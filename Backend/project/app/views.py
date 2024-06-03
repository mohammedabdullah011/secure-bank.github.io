from django.http import JsonResponse, FileResponse #type:ignore
from firebase_admin import auth, firestore, storage #type:ignore
from django.contrib.auth.models import User as DjangoUser #type:ignore
import json, os
import requests  #type:ignore
import base64
from rest_framework.decorators import api_view #type:ignore
from rest_framework.response import Response #type:ignore
from .models import Card, Item, Bill
import time
from datetime import datetime, date
from decimal import Decimal
import luhn #type:ignore
from django.shortcuts import render #type:ignore
from .utils import is_allowed_to_attempt_login


def lockout_view(request):
    return render(request, 'lockout.html')



# Initialize Firestore database
firestore_db = firestore.client()



def create_contact_data(email, message, name):
    user_data = {
        'email': email,
        'message': message,
        'name': name,
        'timestamp': datetime.now().strftime('%Y-%m-%d'),
    }

    try:
        nested_collection_ref = firestore_db.collection('Contact_Messages').document(email)

        # Create a document in the nested collection with a unique ID
        noti_doc_ref = nested_collection_ref.collection(email).document()
        noti_doc_ref.set(user_data)
    except Exception as e:
        raise e


@api_view(['POST'])
def submit_contact_form(request):
    if request.method == 'POST':

        data = json.loads(request.body.decode('utf-8'))
        message = data.get('message')
        email = data.get('email')
        name = data.get('name')
        
        if not message or not email or not name:
            return Response({'error': 'All fields are required'}, status=400)

        create_contact_data(email=email, message=message, name=name)

        return Response({'success': 'Message sent successfully'}, status=200)



def notification(email, title, message):
    user_data = {
        'email': email,
        'message': message,
        'title': title,
        'timestamp': datetime.now().strftime('%Y-%m-%d'),
    }

    try:
        
        nested_collection_ref = firestore_db.collection('Notifications').document(email)

        # Create a document in the nested collection with a unique ID
        noti_doc_ref = nested_collection_ref.collection(email).document()
        noti_doc_ref.set(user_data)
    except Exception as e:
        raise e


def get_notifications(request):
    if request.method == 'GET':
        try:
            # Get the token from the request headers
            id_token = request.headers.get('Authorization')
            
            if not id_token:
                raise ValueError('Authorization token is missing')

            # Validate the token (you need to implement this function)
            decoded_token = decode_firebase_token(id_token)
            
            if not decoded_token:
                raise ValueError('Failed to decode Firebase token')

            # Extract the user's email from the decoded token
            email = decoded_token.get('email')

            if not email:
                raise ValueError('Email not found in token')


            # Define the path
            path = f"Notifications/{email}/{email}"

            # Reference the collection at the specified path
            user_ref = firestore_db.collection(path)

            # Retrieve all documents in the collection
            users_draw = [doc.to_dict() for doc in user_ref.stream()]

            extracted_data = []

            for user_data in users_draw:
                extracted_user_data = {
                    'email': user_data.get('email'),
                    'message': user_data.get('message'),
                    'title': user_data.get('title'),
                    'date': user_data.get('timestamp'),
                }
                extracted_data.append(extracted_user_data)

            # Return the extracted data as a JsonResponse
            return JsonResponse(extracted_data, safe=False)

        except Exception as e:
            # Return an error response if any exception occurs
            return JsonResponse({'error': str(e)}, status=500)

    else:
        # Return a method not allowed response for non-GET requests
        return JsonResponse({'error': 'Method not allowed'}, status=405)





def create_firestore_user(email, last_name, first_name, bio, country, city, taxID, postal_code):
    user_data = {
        'email': email,
        'last_name': last_name,
        'first_name': first_name,
        'bio': bio,
        'country': country,
        'city': city,
        'taxID': taxID,
        'postal_code': postal_code,
    }

    try:
        user_ref = firestore_db.collection('users').document(email)
        user_ref.set(user_data)
    except Exception as e:
        raise e

def register_user(request):
    if request.method == 'POST':
        # Retrieve request data

        data = json.loads(request.body.decode('utf-8'))


        email = data.get('email')
        password = data.get('password')
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        bio = data.get('bio')
        country = data.get('country')
        city = data.get('city')
        taxID = data.get('taxID')
        postal_code = data.get('postal_code')

        # Basic data validation
        if any(value is None or value == '' for value in [email, password, first_name, last_name, bio, country, city, taxID, postal_code]):
            return JsonResponse({'error': 'Missing required fields'}, status=400)

        try:
            # Check if user already exists
            if DjangoUser.objects.filter(username=email).exists():
                return JsonResponse({'error': 'User already exists'}, status=400)
            
            # Create user in Database
            user = DjangoUser.objects.create_user(username=email, email=email, password=password)

            

            # Register user in Firebase Auth
            firebase_user = auth.create_user(email=email, password=password)

            # Generate token for the user
            firebase_token = auth.create_custom_token(firebase_user.uid)

            # Convert the token to a base64-encoded string
            firebase_token_str = base64.b64encode(firebase_token).decode('utf-8')

            # Create Firestore document
            create_firestore_user(email, last_name, first_name, bio, country, city, taxID, postal_code)

            return JsonResponse({'userId': firebase_user.uid, 'token': firebase_token_str})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)






def login(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        
        email = data.get('email')
        password = data.get('password')

        try:
            if not is_allowed_to_attempt_login(request, credentials={'username': email}):
                return JsonResponse({'error': 'You are not allowed to attempt login at this time.'}, status=403)
            # Make a POST request to Firebase Authentication REST API for email/password sign-in
            response = requests.post(
                f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCxKkY-WQvyEdJ41w32DTGisclLLWkbXp8",
                json={
                    "email": email,
                    "password": password,
                    "returnSecureToken": True
                }
            )

            # Check if the request was successful
            if response.ok:
                # Extract the user ID token from the response
                user_id_token = response.json().get("idToken")

                cards_ref = firestore_db.collection('cards').where('user_email', '==', email)
                cards_data = [doc.to_dict() for doc in cards_ref.get()]
                if not cards_data:
                    # Delete user from Firestore
                    user_firestore = firestore_db.collection('users').document(email)
                    user_firestore.delete()
                    
                    # Delete user from Firebase Authentication
                    try:
                        auth.delete_user(auth.get_user_by_email(email).uid)
                    except auth.UserNotFoundError:
                        pass  # User not found in Firebase Authentication

                    # Delete user from Django database
                    try:
                        user_django = DjangoUser.objects.get(email=email)
                        user_django.delete()
                    except DjangoUser.DoesNotExist:
                        pass  # User not found in Django database

                    return JsonResponse({'error': 'User is banned: No card associated with the account'}, status=403)


                return JsonResponse({'idToken': user_id_token})

            else:
                # If the request was not successful, return the error response
                return JsonResponse({'error': response.json().get("error").get("message")}, status=response.status_code)

        except Exception as e:
            # Handle unexpected errors
            return JsonResponse({'error': 'Unexpected error: ' + str(e)}, status=500)

    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)


def logout(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'message': 'Logout successful'})
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    











def create_firestore_card(user_email, card_number, expiry_date, cvv, address, type_card):
    user_data = {
        'user_email': user_email,
        'card_number': card_number,
        'expiry_date': expiry_date,
        'cvv': cvv,
        'address': address,
        'type_card': type_card,
    }

    try:
        user_ref = firestore_db.collection('cards').document(user_email)
        user_ref.set(user_data)
        transaction_data = {
            'user_email': user_email,
            'amount': 10.00, 

        }
        transaction_ref = firestore_db.collection('transactions').document()
        transaction_ref.set(transaction_data)
    except Exception as e:
        raise e
    




def add_card(request):
    if request.method == 'POST':
        # Retrieve request data
        data = json.loads(request.body.decode('utf-8'))
        user_email = data.get('user_email')
        card_number = data.get('card_number')
        expiry_date = data.get('expiry_date')
        cvv = data.get('cvv')
        address = data.get('address')
        type_card = data.get('type_card')

        # Basic data validation
        if any(value is None or value == '' for value in [user_email, card_number, expiry_date, cvv, address, type_card]):
            return JsonResponse({'error': 'Missing required fields'}, status=400)

        # Validate card number using Luhn algorithm
        if not luhn.verify(card_number):
            return JsonResponse({'error': 'Invalid card number'}, status=400)

        try:
            # Create Firestore document
            create_firestore_card(user_email, card_number, expiry_date, cvv, address, type_card)

            return JsonResponse({'card': type_card})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)




def decode_firebase_token(firebase_token):
    try:
        # Split the token string by space and take the last part which is the actual token
        token_parts = firebase_token.split(' ')
        if len(token_parts) != 2:  # Check if token is in expected format
            raise ValueError("Invalid token format")
        firebase_token = token_parts[1]  # Extract the actual token
        
        decoded_token = auth.verify_id_token(firebase_token)
        # The decoded token contains various claims like uid, email, etc.
        return decoded_token
    
    except ValueError as e:
        # Handle invalid tokens
        print("Token is invalid:", e)
        return None
    except auth.InvalidIdTokenError as e:
        # Handle invalid ID tokens (expired, revoked, or invalid signatures)
        print("Invalid ID token:", e)
        return None
    except auth.FirebaseError as e:
        # Handle other Firebase authentication errors
        print("Firebase authentication error:", e)
        return None
    except Exception as e:
        # Handle any other unexpected errors
        print("An unexpected error occurred:", e)
        return None









def get_user_data(request):
    try:
        # Get the token from the request headers
        id_token = request.headers.get('Authorization')
        
        if not id_token:
            raise ValueError('Authorization token is missing')

        # Validate the token
        decoded_token = decode_firebase_token(id_token)
        
        if not decoded_token:
            raise ValueError('Failed to decode Firebase token')

        # Extract the user's email from the decoded token
        email = decoded_token.get('email')

        if not email:
            raise ValueError('Email not found in token')

        # Query the 'users' collection for user data based on email
        user_ref = firestore_db.collection('users').document(email)
        user_data = user_ref.get().to_dict()

        # Query the 'cards' collection for cards data based on user_email
        cards_ref = firestore_db.collection('cards').where('user_email', '==', email)
        cards_data = [doc.to_dict() for doc in cards_ref.get()]



    
        # Check if cards_data is empty
        if not cards_data:
            raise ValueError('No card data found for the user')


        extracted_data = []

            # Assuming user_data is a dictionary
        if user_data:
            extracted_user_data = {
                'email': user_data.get('email'),
                'first_name': user_data.get('first_name'),
                'last_name': user_data.get('last_name'),
                'bio': user_data.get('bio'),
                'country': user_data.get('country'),
                'city': user_data.get('city'),
                'taxID': user_data.get('taxID'),
                'postal_code': user_data.get('postal_code'),
                'image_url': 'https://localhost:8000/static/' + user_data.get('image_url', 'profile.png'),
                'phone': user_data.get('phone', ''),
                # Add more fields as needed
            }
            extracted_data.append(extracted_user_data)

        # Assuming cards_data is a list of dictionaries
        for card in cards_data:
            extracted_card_data = {
                'card_number': card.get('card_number'),
                'expiry_date': card.get('expiry_date'),
                'cvv': card.get('cvv'),
                'address': card.get('address'),
                'type_card': card.get('type_card'),
                # Add more fields as needed
            }
            extracted_data.append(extracted_card_data)



        # Return the extracted data as a JsonResponse
        return JsonResponse(extracted_data, safe=False)

    except ValueError as ve:
        return JsonResponse({'error': str(ve)}, status=500)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)





















def create_firestore_withdraw(user_email, credit, amount, currency, description, create_at):
    withdrawal_data = {
        'user_email': user_email,
        'credit': credit,
        'amount': amount,
        'currency': currency,
        'description': description,
        'create_at': create_at,
    }

    try:
        # Create a reference to the nested collection path using the user's email
        nested_collection_ref = firestore_db.collection('withdraw').document(user_email)

        # Create a document in the nested collection with a unique ID
        withdrawal_doc_ref = nested_collection_ref.collection(user_email).document()
        withdrawal_doc_ref.set(withdrawal_data)
    except Exception as e:
        raise e



def is_valid_date(date_str):
    """Validate the date format and check for valid day values."""
    try:
        datetime.strptime(date_str, '%Y-%m-%d')
        # Ensure the day is not zero
        year, month, day = map(int, date_str.split('-'))
        if day == 0:
            return False
        return True
    except ValueError:
        return False






def withdraw(request):
    if request.method == 'POST':
        try:
            # Get the token from the request headers
            id_token = request.headers.get('Authorization')
            
            if not id_token:
                raise ValueError('Authorization token is missing')

            # Validate the token
            decoded_token = decode_firebase_token(id_token)
            
            if not decoded_token:
                raise ValueError('Failed to decode Firebase token')

            # Extract the user's email from the decoded token
            email = decoded_token.get('email')

            if not email:
                raise ValueError('Email not found in token')

            data = json.loads(request.body.decode('utf-8'))
            create_at = datetime.now().strftime('%Y-%m-%d')

            # Fetch the user's card details
            cards_ref = firestore_db.collection('cards').where('user_email', '==', email)
            cards_data = [doc.to_dict() for doc in cards_ref.get()]

            # Check if any card is expired
            for card in cards_data:
                expiry_date_str = card.get('expiry_date')  # Assuming 'expiry_date' is in 'YYYY-MM-DD' format
                if expiry_date_str:
                    
                    if not is_valid_date(expiry_date_str):
                        return JsonResponse({'error': 'Invalid card expiry date format, Please Change Your Credit Card'}, status=400)
                    
            # Conversion rates
            USD_TO_EUR_RATE = Decimal('0.92')
            USD_TO_EGP_RATE = Decimal('46.90')

            withdrawal_amount = Decimal(data.get('amount', '0'))
            if data.get('currency') == 'EUR':
                withdrawal_amount = withdrawal_amount / USD_TO_EUR_RATE
            elif data.get('currency') == 'EGP':
                withdrawal_amount = withdrawal_amount / USD_TO_EGP_RATE

            # Query Firestore for transactions related to the specific user
            transactions_ref = firestore_db.collection('transactions')
            user_transactions = transactions_ref.where('user_email', '==', email).stream()

            sufficient_funds = False
            for transaction in user_transactions:
                transaction_data = transaction.to_dict()
                current_balance = Decimal(transaction_data.get('amount'))
                if current_balance >= withdrawal_amount:
                    new_balance = current_balance - withdrawal_amount
                    formatted_balance = '{:.2f}'.format(new_balance)
                    transaction.reference.update({'amount': formatted_balance})
                    
                    user_email = email
                    credit = data.get('credit')
                    amount = data.get('amount')
                    currency = data.get('currency')
                    description = data.get('description', '')

                    # Basic data validation
                    if any(value is None or value == '' for value in [user_email, credit, amount, currency, create_at]):
                        return JsonResponse({'error': 'Missing required fields'}, status=400)

                    # Create a unique collection name based on user email and timestamp
                    collection_name = f"{user_email.replace('@', '_').replace('.', '_')}_{int(time.time())}"

                    # Create Firestore document in the dynamically generated collection
                    create_firestore_withdraw(user_email, credit, amount, currency, description, create_at)
                
                    return JsonResponse({'description': description, 'status': 'Withdrawal successful'})
                
                if not sufficient_funds:
                    return JsonResponse({'error': 'Insufficient funds'}, status=400)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    


def create_firestore_pay(user_email, to, amount, currency, description, create_at):
    pay_data = {
        'user_email': user_email,
        'to': to,
        'amount': amount,
        'currency': currency,
        'description': description,
        'create_at': create_at,
    }

    try:
        # Create a reference to the nested collection path using the user's email
        nested_collection_ref = firestore_db.collection('pay').document(user_email)

        # Create a document in the nested collection with a unique ID
        pay_doc_ref = nested_collection_ref.collection(user_email).document()
        pay_doc_ref.set(pay_data)
    except Exception as e:
        raise e


def create_firestore_pay_double(user_email, to, amount, currency, description, create_at):
    pay_data = {
        'user_email': to,
        'to': user_email,
        'amount': amount,
        'currency': currency,
        'description': description,
        'create_at': create_at,
    }

    try:
        # Create a reference to the nested collection path using the user's email
        nested_collection_ref = firestore_db.collection('pay_double').document(to)

        # Create a document in the nested collection with a unique ID
        pay_doc_ref = nested_collection_ref.collection(to).document()
        pay_doc_ref.set(pay_data)
    except Exception as e:
        raise e










def pay(request):
    if request.method == 'POST':
        try:
            # Get the token from the request headers
            id_token = request.headers.get('Authorization')
            if not id_token:
                return JsonResponse({'error': 'Authorization token is missing'}, status=400)

            # Validate the token
            decoded_token = decode_firebase_token(id_token)
            if not decoded_token:
                return JsonResponse({'error': 'Failed to decode Firebase token'}, status=400)

            # Extract the user's email from the decoded token
            email = decoded_token.get('email')
            if not email:
                return JsonResponse({'error': 'Email not found in token'}, status=400)

            data = json.loads(request.body.decode('utf-8'))
            created_at = datetime.now().strftime('%Y-%m-%d')

            # Retrieve all users from Firebase Authentication
            all_users = auth.list_users().users
            email_list = [user.email for user in all_users]

            recipient_email = data.get('to')
            if recipient_email not in email_list:
                return JsonResponse({'error': 'Recipient email not found'}, status=404)
                
            if recipient_email == email:
                return JsonResponse({'error': 'Cannot pay to yourself'}, status=400)

            USD_TO_EUR_RATE = Decimal('0.92')
            USD_TO_EGP_RATE = Decimal('46.90')

            pay_amount = Decimal(data.get('amount', '0'))
            usd_amount = Decimal('0.0')
            
            if data.get('currency') == 'EUR':
                usd_amount = pay_amount / USD_TO_EUR_RATE
            elif data.get('currency') == 'EGP':
                usd_amount = pay_amount / USD_TO_EGP_RATE
            else:
                usd_amount = pay_amount

            # Query Firestore for transactions related to the specific user
            transactions_ref = firestore_db.collection('transactions')
            user_transactions = transactions_ref.where('user_email', '==', email).stream()

            sufficient_funds = False
            for transaction in user_transactions:
                transaction_data = transaction.to_dict()
                current_balance = Decimal(transaction_data.get('amount'))
                
                if current_balance >= usd_amount:
                    sufficient_funds = True
                    new_balance = current_balance - usd_amount
                    transaction.reference.update({'amount': str(new_balance)})

                    # Prepare data for new transaction
                    amount = str(pay_amount)
                    currency = data.get('currency')
                    description = data.get('description', '')
                    to = recipient_email

                    # Basic data validation
                    if any(value is None or value == '' for value in [email, to, amount, currency, created_at]):
                        return JsonResponse({'error': 'Missing required fields'}, status=400)

                    # Update recipient's balance
                    recipient_transactions = transactions_ref.where('user_email', '==', recipient_email).stream()
                    for recipient_transaction in recipient_transactions:
                        recipient_transaction_data = recipient_transaction.to_dict()
                        recipient_balance = Decimal(recipient_transaction_data.get('amount'))
                        new_recipient_balance = recipient_balance + usd_amount
                        recipient_transaction.reference.update({'amount': str(new_recipient_balance)})
                        break  # Assuming there's only one document per user in transactions

                    # Create Firestore document in the transactions collection
                    create_firestore_pay(email, to, amount, currency, description, created_at)
                    create_firestore_pay_double(email, to, amount, currency, description, created_at)

                    return JsonResponse({'description': description, 'status': 'Pay successful'})

            if not sufficient_funds:
                return JsonResponse({'error': 'Insufficient funds'}, status=400)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)


def create_firestore_item_bill(bill_ref, title, price, currency):
    item_data = {
        'title': title,
        'price': price,
        'currency': currency
    }
    try:
        item_ref = bill_ref.collection('items').document()
        item_ref.set(item_data)
    except Exception as e:
        raise e

def create_firestore_bill(user_email, title, to, description, items):
    timestamp = datetime.now().strftime('%Y-%m-%d')
    bill_data = {
        'title': title,
        'to': to,
        'description': description,
        'created_at': timestamp,
        'items': items,
    }
    rev_data = {
        'title': title,
        'to': user_email,
        'description': description,
        'created_at': timestamp,
        'items': items,
    }
    try:
        # Create the main bill document
        user_ref = firestore_db.collection('bills').document(user_email)
        doc_ref = user_ref.collection(user_email).document()
        doc_ref.set(bill_data)

        # Create the duplicate bill document
        duplicate_ref = firestore_db.collection('bills_double').document(to)
        doc_ref_dou = duplicate_ref.collection(to).document()
        doc_ref_dou.set(rev_data)


        return user_ref, duplicate_ref
    except Exception as e:
        raise e

def create_bill(request):
    if request.method == 'POST':
        try:
            id_token = request.headers.get('Authorization')
            if not id_token:
                raise ValueError('Authorization token is missing')

            decoded_token = decode_firebase_token(id_token)
            if not decoded_token:
                raise ValueError('Failed to decode Firebase token')

            user_email = decoded_token.get('email')
            if not user_email:
                raise ValueError('Email not found in token')

            data = json.loads(request.body.decode('utf-8'))
            all_users = auth.list_users().users
            email_list = [user.email for user in all_users]

            recipient_email = data.get('to')
            if recipient_email not in email_list:
                return JsonResponse({'error': 'Recipient email not found'}, status=404)

            if recipient_email == user_email:
                return JsonResponse({'error': 'Cannot bill to yourself'}, status=400)

            title = data.get('title')
            description = data.get('description')
            to = data.get('to')
            items = data.get('items', [])

            if any(value is None or value == '' for value in [title, description, to]):
                return JsonResponse({'error': 'Missing required fields'}, status=400)




            # Create the bill
            bill_ref, duplicate_ref = create_firestore_bill(user_email, title, to, description, items)

            # Create items associated with the bill
            for item_data in items:
                create_firestore_item_bill(bill_ref, item_data.get('title'), item_data.get('price'), item_data.get('currency'))
                create_firestore_item_bill(duplicate_ref, item_data.get('title'), item_data.get('price'), item_data.get('currency'))

            return JsonResponse({'success': 'Bill created successfully'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

























def get_image(request):
    if request.method == 'POST' and request.FILES.get('image_file'):
        try:
            # Get the token from the request headers
            id_token = request.headers.get('Authorization')
            if not id_token:
                raise ValueError('Authorization token is missing')

            # Validate the token
            decoded_token = decode_firebase_token(id_token)
            if not decoded_token:
                raise ValueError('Failed to decode Firebase token')

            # Extract the user's email from the decoded token
            user_email = decoded_token.get('email')
            if not user_email:
                raise ValueError('Email not found in token')

            # Get the uploaded image file
            image_file = request.FILES['image_file']

            # Define the directory where images will be saved
            upload_dir = os.path.join('app', 'Image')

            # Create the upload directory if it doesn't exist
            os.makedirs(upload_dir, exist_ok=True)

            # Rename the image file with the user's email
            filename, extension = os.path.splitext(image_file.name)
            new_filename = f"{user_email}.jpg"
            image_file.name = new_filename

            # Save the image file to the upload directory
            with open(os.path.join(upload_dir, image_file.name), 'wb+') as destination:
                for chunk in image_file.chunks():
                    destination.write(chunk)
            
            # Return success response
            return JsonResponse({'success': True, 'message': 'Image uploaded successfully'})
            
        except Exception as e:
            return JsonResponse({'error': str(e), 'success': False}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)



def serve_image(request, image_name):
    # Define the directory where images are saved
    image_dir = os.path.join('app', 'Image')
    # Construct the full path to the image
    image_path = os.path.join(image_dir, image_name)
    
    if os.path.exists(image_path):
        # Return the image file using Django's FileResponse
        return FileResponse(open(image_path, 'rb'))
    else:
        return JsonResponse({'error': 'Image not found'}, status=404)
    



























def edit_profile(request):
    if request.method == 'POST':
        try:
            # Get the token from the request headers
            id_token = request.headers.get('Authorization')
            if not id_token:
                raise ValueError('Authorization token is missing')

            # Validate the token
            decoded_token = decode_firebase_token(id_token)
            if not decoded_token:
                raise ValueError('Failed to decode Firebase token')

            # Extract the user's email from the decoded token
            user_email = decoded_token.get('email')
            if not user_email:
                raise ValueError('Email not found in token')

            # Retrieve request data
            data = json.loads(request.body.decode('utf-8'))

            # Get the filename based on the user's email
            filename = f"{user_email}.jpg"  # Assuming images are PNG format
            
            # Define the directory where images are saved
            image_dir = os.path.join('app', 'Image')

            # Construct the full path to the image
            image_path = os.path.join(image_dir, filename)

            if os.path.exists(image_path):
                # Construct the image URL
                image_url = filename # Adjust URL pattern as needed

                # Initialize a dictionary to hold updated data
                updated_data = {}

                # Update fields only if they have changed
                for field in ['first_name', 'last_name', 'bio', 'country', 'city', 'postal_code', 'gender', 'date_of_birth', 'taxID']:
                    if field in data:
                        updated_data[field] = data[field]

                
                # Add email and image_url
                updated_data.update({'email': user_email, 'image_url': image_url})

                # Update user data in Firestore
                db = firestore.client()
                user_ref = db.collection('users').document(user_email)
                user_ref.update(updated_data)

                return JsonResponse({'success': True, 'message': 'User data updated successfully'})
                

            else:
                default_image_path = 'profile.png'
                return f"/static/{default_image_path}"
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)






def update_card(request):
    if request.method == 'POST':
        try:
            # Get the token from the request headers
            id_token = request.headers.get('Authorization')
            if not id_token:
                raise ValueError('Authorization token is missing')

            # Validate the token
            decoded_token = decode_firebase_token(id_token)
            if not decoded_token:
                raise ValueError('Failed to decode Firebase token')

            # Extract the user's email from the decoded token
            user_email = decoded_token.get('email')
            if not user_email:
                raise ValueError('Email not found in token')

            # Retrieve request data
            data = json.loads(request.body.decode('utf-8'))

            

            updated_data = {
                'card_number' : data.get('card_number'),
                'expiry_date' : data.get('expiry_date'),
                'cvv' : data.get('cvv'),
                'address' : data.get('address'),
                'type_card' : data.get('type_card'),
            }

            # Update user data in Firestore
            db = firestore.client()
            user_ref = db.collection('cards').document(user_email)
            user_ref.update(updated_data)

            return JsonResponse({'success': True, 'message': 'User data updated successfully'})

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)



















def change_password(request):
    if request.method == 'POST':
        try:
            # Get the token from the request headers
            id_token = request.headers.get('Authorization')
            if not id_token:
                raise ValueError('Authorization token is missing')

            # Validate the token
            decoded_token = decode_firebase_token(id_token)
            if not decoded_token:
                raise ValueError('Failed to decode Firebase token')

            # Extract the user's UID from the decoded token
            user_uid = decoded_token.get('uid')
            email = decoded_token.get('email')
            if not user_uid:
                raise ValueError('UID not found in token')

            # Retrieve request data
            data = json.loads(request.body.decode('utf-8'))
            old_password = data.get('old_password')
            new_password = data.get('new_password')

            if not old_password or not new_password:
                raise ValueError('Old password or new password is missing')

            # Re-authenticate the user with their current credentials
            response = requests.post(
                f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCxKkY-WQvyEdJ41w32DTGisclLLWkbXp8",
                json={
                    "email": email,
                    "password": old_password,

                }
            )
            if response.ok:
                # Update user's password using Firebase Admin SDK
                auth.update_user(user_uid, password=new_password)
                notification(email=email, title='Password Changed', message='Your password has been successfully changed.')
                return JsonResponse({'success': True, 'message': 'Password updated successfully'})
            else:
                raise ValueError('Invalid old password')


        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)



















def update_phone(request):
    if request.method == 'POST':
        try:
            # Get the token from the request headers
            id_token = request.headers.get('Authorization')
            if not id_token:
                raise ValueError('Authorization token is missing')

            # Validate the token
            decoded_token = decode_firebase_token(id_token)
            if not decoded_token:
                raise ValueError('Failed to decode Firebase token')

            # Extract the user's email from the decoded token
            user_email = decoded_token.get('email')
            if not user_email:
                raise ValueError('Email not found in token')

            # Retrieve request data
            data = json.loads(request.body.decode('utf-8'))

            

            updated_data = {
                'phone' : data.get('phone'),
            }

            # Update user data in Firestore
            db = firestore.client()
            user_ref = db.collection('users').document(user_email)
            user_ref.update(updated_data)

            return JsonResponse({'success': True, 'message': 'User data updated successfully'})

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)














def remove_account(request):
    if request.method == 'POST':
        try:
            # Get the token from the request headers
            id_token = request.headers.get('Authorization')
            if not id_token:
                return JsonResponse({'success': False, 'error': 'Authorization token is missing'}, status=400)

            # Validate the token
            decoded_token = decode_firebase_token(id_token)
            if not decoded_token:
                return JsonResponse({'success': False, 'error': 'Failed to decode Firebase token'}, status=400)

            email = decoded_token.get('email')
            user_uid = decoded_token.get('uid')
            if not email or not user_uid:
                return JsonResponse({'success': False, 'error': 'Email or UID not found in token'}, status=400)

            batch = firestore_db.batch()

            # Delete the Firestore user document
            user_ref = firestore_db.collection('users').where('email', '==', email)
            for doc in user_ref.stream():
                batch.delete(doc.reference)

            # Delete Firebase Authentication user
            auth.delete_user(user_uid)

            # Delete user from Django if exists
            DjangoUser.objects.filter(username=email).delete()

            # Delete transactions related to the user
            transactions_ref = firestore_db.collection('transactions').where('user_email', '==', email)
            for doc in transactions_ref.stream():
                batch.delete(doc.reference)

            # Delete other user-related data
            batch.delete(firestore_db.collection('cards').document(email))

            nested_collections = ['withdraw', 'pay', 'bills', 'bills_double', 'pay_double']
            for collection_name in nested_collections:
                nested_collection_ref = firestore_db.collection(collection_name).document(email).collection(email)
                for doc in nested_collection_ref.stream():
                    batch.delete(doc.reference)

            # Commit batch operations
            batch.commit()

            # Remove the user's image from the directory
            image_dir = os.path.join('app', 'Image')
            user_image_path = os.path.join(image_dir, f"{email}.jpg")
            if os.path.exists(user_image_path):
                os.remove(user_image_path)

            
            return JsonResponse({'success': True, 'message': 'User account removed successfully'})

        except ValueError as ve:
            return JsonResponse({'success': False, 'error': str(ve)}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'error': f'An error occurred: {str(e)}'}, status=500)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)


def get_bills(request):
    try:
        # Get the token from the request headers
        id_token = request.headers.get('Authorization')
        
        if not id_token:
            raise ValueError('Authorization token is missing')

        # Validate the token
        decoded_token = decode_firebase_token(id_token)
        
        if not decoded_token:
            raise ValueError('Failed to decode Firebase token')

        # Extract the user's email from the decoded token
        email = decoded_token.get('email')

        if not email:
            raise ValueError('Email not found in token')

        # Query Firestore for bills for the specific user
        extracted_data = []


        # Retrieve all users from Firebase Authentication
        all_users = auth.list_users()

        # Extract email addresses from each user
        email_list = [user.email for user in all_users.users]

        

        # Define the path to the bills collection
        bills_path = f"bills/{email}/{email}"

        # Reference the bills collection
        bills_ref = firestore_db.collection(bills_path)

        # Retrieve all documents in the bills collection
        bills = [doc.to_dict() for doc in bills_ref.stream()]

        # Process bills
        for bill in bills:

            extracted_bill_data = {
                'title': bill.get('title'),
                'description': bill.get('description'),
                'to': bill.get('to'),
                'items': bill.get('items', []),
                'from': email,
                'date': bill.get('created_at'),
            }
            extracted_data.append(extracted_bill_data)
                





        # Define the path to the bills collection
        bills_path = f"bills_double/{email}/{email}"

        # Reference the bills collection
        bills_ref = firestore_db.collection(bills_path)

        # Retrieve all documents in the bills collection
        bills = [doc.to_dict() for doc in bills_ref.stream()]

        # Process bills
        for bill in bills:
            extracted_bill_data = {
                'title': bill.get('title'),
                'description': bill.get('description'),
                'to': email,
                'items': bill.get('items', []),
                'from': bill.get('to'),
                'date': bill.get('created_at'),
            }
            extracted_data.append(extracted_bill_data)

        # Return the extracted data as a JsonResponse
        return JsonResponse(extracted_data, safe=False)
    
    except ValueError as ve:
        return JsonResponse({'error': str(ve)}, status=500)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)



def get_transactions(request):
    try:
        # Get the token from the request headers
        id_token = request.headers.get('Authorization')
        
        if not id_token:
            raise ValueError('Authorization token is missing')

        # Validate the token
        decoded_token = decode_firebase_token(id_token)
        
        if not decoded_token:
            raise ValueError('Failed to decode Firebase token')

        # Extract the user's email from the decoded token
        email = decoded_token.get('email')

        if not email:
            raise ValueError('Email not found in token')

        # Initialize an empty list to store extracted data
        extracted_data = []

        # Query Firestore for pay transactions for the specific user
        pay = f"pay_double/{email}/{email}"
        transactions_ref = firestore_db.collection(pay)

        trans_pay = [doc.to_dict() for doc in transactions_ref.stream()]
        for pay_transaction in trans_pay:
            amount = pay_transaction.get('amount')
            extracted_pay_data = {
                'from': pay_transaction.get('to'),
                'date': pay_transaction.get('create_at'),
                'to': pay_transaction.get('user_email'),
                'amount': f"+{amount}",
                'description': pay_transaction.get('description'),
                'currency': pay_transaction.get('currency'),
                'type': 'Pay',
            }
            extracted_data.append(extracted_pay_data)

        # Define the path for additional pay transactions
        path = f"pay/{email}/{email}"
        transactions_ref = firestore_db.collection(path)
        trans_pay = [doc.to_dict() for doc in transactions_ref.stream()]

        # Process pay transactions
        for pay_transaction in trans_pay:
            amount = pay_transaction.get('amount')
            extracted_pay_data = {
                'from': pay_transaction.get('user_email'),
                'date': pay_transaction.get('create_at'),
                'to': pay_transaction.get('to'),
                'amount': f"-{amount}",
                'description': pay_transaction.get('description'),
                'currency' : pay_transaction.get('currency'),
                'type': 'Pay',
            }
            extracted_data.append(extracted_pay_data)

        # Define the path for withdraw transactions
        path = f"withdraw/{email}/{email}"
        withdraw_ref = firestore_db.collection(path)
        trans_draw = [doc.to_dict() for doc in withdraw_ref.stream()]

        # Process withdraw transactions
        for withdraw_transaction in trans_draw:
            extracted_draw_data = {
                'from': withdraw_transaction.get('user_email'),
                'date': withdraw_transaction.get('create_at'),
                'to': withdraw_transaction.get('credit'),
                'amount': withdraw_transaction.get('amount'),
                'description': withdraw_transaction.get('description'),
                'currency': withdraw_transaction.get('currency'),
                'type': 'Withdraw',
            }
            extracted_data.append(extracted_draw_data)

        # Return the extracted data as a JsonResponse
        return JsonResponse(extracted_data, safe=False)
    
    except ValueError as ve:
        return JsonResponse({'error': str(ve)}, status=400)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)












def get_profit(request):
    try:
        # Get the token from the request headers
        id_token = request.headers.get('Authorization')
        
        if not id_token:
            raise ValueError('Authorization token is missing')

        # Validate the token
        decoded_token = decode_firebase_token(id_token)
        
        if not decoded_token:
            raise ValueError('Failed to decode Firebase token')

        # Extract the user's email from the decoded token
        email = decoded_token.get('email')

        if not email:
            raise ValueError('Email not found in token')


        withdraw_all = Decimal('0.00')
        pay_all = Decimal('0.00')
        balance = Decimal('0.00')
        profit = Decimal('0.00')
        USD_TO_EUR_RATE = Decimal('0.92')
        USD_TO_EGP_RATE = Decimal('46.90')

        # Query Firestore for pay transactions for the specific user
        extracted_data = []

        # Query Firestore for transactions related to the specific user
        transactions_ref = firestore_db.collection('transactions')
        user_transactions = transactions_ref.where('user_email', '==', email).stream()

        # Iterate over the transactions and calculate balance
        for transaction in user_transactions:
            transaction_data = transaction.to_dict()
            amount_str = transaction_data.get('amount', '0')  # Ensure default value is provided if 'amount' is missing
            try:
                amount = Decimal(amount_str)
                balance += amount
                profit += Decimal('10.00')
            except ValueError:
                # Handle invalid amount values here
                pass

        # Retrieve all users from Firebase Authentication
        all_users = auth.list_users()

        # Extract email addresses from each user
        email_list = [user.email for user in all_users.users]

        pay = f"pay_double/{email}/{email}"
        transactions_ref = firestore_db.collection(pay)

        trans_pay = [doc.to_dict() for doc in transactions_ref.stream()]
        for pay_transaction in trans_pay:
            amount = Decimal(str(pay_transaction.get('amount')))
            currency = pay_transaction.get('currency')
        
            if currency == 'EUR':
                amount = amount / USD_TO_EUR_RATE
            elif currency == 'EGP':
                amount = amount / USD_TO_EGP_RATE

            
            profit += amount

        # Define the path for additional pay transactions
        path = f"pay/{email}/{email}"
        transactions_ref = firestore_db.collection(path)
        trans_pay = [doc.to_dict() for doc in transactions_ref.stream()]

        # Process pay transactions
        for pay_transaction in trans_pay:
            amount = Decimal(str(pay_transaction.get('amount')))
            currency = pay_transaction.get('currency')
            
            if currency == 'EUR':
                amount = amount / USD_TO_EUR_RATE
            elif currency == 'EGP':
                amount = amount / USD_TO_EGP_RATE

            extracted_pay_data = {
                'from': pay_transaction.get('user_email'),
                'date': pay_transaction.get('create_at'),
                'to': pay_transaction.get('to'),
                'amount': pay_transaction.get('amount'),
                'description': pay_transaction.get('description'),
                'type': 'Pay',
            }
            extracted_data.append(extracted_pay_data)
            pay_all += amount

        # Define the path for withdraw transactions
        path = f"withdraw/{email}/{email}"
        withdraw_ref = firestore_db.collection(path)
        trans_draw = [doc.to_dict() for doc in withdraw_ref.stream()]

        # Process withdraw transactions
        for withdraw_transaction in trans_draw:
            amount = Decimal(str(withdraw_transaction.get('amount')))
            currency = withdraw_transaction.get('currency')

            if currency == 'EUR':
                amount = amount / USD_TO_EUR_RATE
            elif currency == 'EGP':
                amount = amount / USD_TO_EGP_RATE

            extracted_draw_data = {
                'from': withdraw_transaction.get('user_email'),
                'date': withdraw_transaction.get('create_at'),
                'to': withdraw_transaction.get('credit'),
                'amount': '{:.2f}'.format(amount),
                'description': withdraw_transaction.get('description'),
                'currency': withdraw_transaction.get('currency'),
                'type': 'Withdraw',
            }
            extracted_data.append(extracted_draw_data)
            withdraw_all += amount

        # Update the balance in Firestore transactions
        transactions_ref = firestore_db.collection('transactions')
        user_transactions = transactions_ref.where('user_email', '==', email).stream()

        for transaction in user_transactions:
            transaction_data = transaction.to_dict()
            transaction.reference.update({'amount': str(balance)})

        formatted_balance = '{:.2f}'.format(balance)
        formatted_withdraw = '{:.2f}'.format(withdraw_all)
        formatted_pay = '{:.2f}'.format(pay_all)
        formatted_profit = '{:.2f}'.format(profit)

        # Return the extracted data as a JsonResponse
        return JsonResponse({
            'withdraw_all': Decimal(formatted_withdraw),
            'pay_all': Decimal(formatted_pay),
            'balance': Decimal(formatted_balance),
            'profit': Decimal(formatted_profit)
        })

    except ValueError as ve:
        return JsonResponse({'error': str(ve)}, status=400)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
















def get_profit_for_month(request):
    if request.method == 'POST':
        try:
            # Get the token from the request headers
            id_token = request.headers.get('Authorization')

            if not id_token:
                raise ValueError('Authorization token is missing')

            # Validate the token
            decoded_token = decode_firebase_token(id_token)

            if not decoded_token:
                raise ValueError('Failed to decode Firebase token')

            # Extract the user's email from the decoded token
            email = decoded_token.get('email')
            data = json.loads(request.body.decode('utf-8'))
            month = int(data.get('month'))
            current_year = datetime.now().year

            if not email:
                raise ValueError('Email not found in token')

            withdraw_all = Decimal(0.0)
            pay_all = Decimal(0.0)
            balance = Decimal(0.0)
            profit = Decimal(0.0)


            USD_TO_EUR_RATE = Decimal('0.92')
            USD_TO_EGP_RATE = Decimal('46.90')

            transactions_ref = firestore_db.collection('transactions')
            user_transactions = transactions_ref.where('user_email', '==', email).stream()

        # Iterate over the transactions and calculate balance
            for transaction in user_transactions:
                transaction_data = transaction.to_dict()
                amount_str = transaction_data.get('amount', '0')  # Ensure default value is provided if 'amount' is missing
                try:
                    amount = Decimal(amount_str)
                    balance += amount
                    profit +=Decimal(amount)
                    
                except ValueError:
                    # Handle invalid amount values here
                    pass
            

            # Query Firestore for pay transactions for the specific user
            extracted_data = []

            # Retrieve all users from Firebase Authentication
            all_users = auth.list_users()

            # Extract email addresses from each user
            email_list = [user.email for user in all_users.users]

        
            pay = f"pay_double/{email}/{email}"
            transactions_ref = firestore_db.collection(pay)

            trans_pay = [doc.to_dict() for doc in transactions_ref.stream()]
            for pay_transaction in trans_pay:
                create_at = pay_transaction.get('create_at')
                if create_at:
                    transaction_date = datetime.strptime(create_at.split('T')[0], '%Y-%m-%d')
                    transaction_year = transaction_date.year
                    transaction_month = transaction_date.month
                    if transaction_year == current_year and transaction_month == month:
                        
                        balance += Decimal(pay_transaction.get('amount'))
                        profit += Decimal(pay_transaction.get('amount'))

            # Retrieve pay transactions for the user
            path = f"pay/{email}/{email}"
            transactions_ref = firestore_db.collection(path)
            trans_pay = [doc.to_dict() for doc in transactions_ref.stream()]

            # Process pay transactions
            for pay_transaction in trans_pay:
                create_at = pay_transaction.get("create_at")
                if create_at:
                    transaction_date = datetime.strptime(create_at.split('T')[0], '%Y-%m-%d')
                    transaction_year = transaction_date.year
                    transaction_month = transaction_date.month
                    if transaction_year == current_year and transaction_month == month:
                            amount = Decimal(str(pay_transaction.get('amount')))
                            currency = pay_transaction.get('currency')
                            
                            # Convert the amount to USD if it's in a different currency
                            if currency == 'EUR':
                                amount = amount / USD_TO_EUR_RATE
                            elif currency == 'EGP':
                                amount = amount / USD_TO_EGP_RATE

                            pay_all += amount

            # Retrieve withdraw transactions for the user
            path = f"withdraw/{email}/{email}"
            withdraw_ref = firestore_db.collection(path)
            trans_draw = [doc.to_dict() for doc in withdraw_ref.stream()]



            # Process withdraw transactions
            for withdraw_transaction in trans_draw:
                create_at = withdraw_transaction.get('create_at')
                if create_at:
                    transaction_date = datetime.strptime(create_at.split('T')[0], '%Y-%m-%d')
                    transaction_year = transaction_date.year
                    transaction_month = transaction_date.month
                    if transaction_year == current_year and transaction_month == month:
                            amount = Decimal(str(withdraw_transaction.get('amount')))
                            currency = withdraw_transaction.get('currency')
                            
                            # Convert the amount to USD if it's in a different currency
                            if currency == 'EUR':
                                amount = amount / USD_TO_EUR_RATE
                            elif currency == 'EGP':
                                amount = amount / USD_TO_EGP_RATE

                            withdraw_all += amount
            

            formatted_balance = '{:.2f}'.format(balance)
            formatted_withdraw = '{:.2f}'.format(withdraw_all)
            formatted_pay = '{:.2f}'.format(pay_all)
            formatted_profit = '{:.2f}'.format(profit)

            

            return JsonResponse({'withdraw_all': formatted_withdraw, 'pay_all': formatted_pay, 'balance': formatted_balance, 'profit': formatted_profit, 'month': month})

        except ValueError as ve:
            return JsonResponse({'error': str(ve)}, status=500)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
