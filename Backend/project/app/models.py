from django.db import models #type: ignore

class User(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    first_name = models.CharField(max_length=128)
    last_name = models.CharField(max_length=128)
    bio = models.CharField(max_length=128)
    country = models.CharField(max_length=128)
    city = models.CharField(max_length=128)
    taxID = models.CharField(max_length=128)
    postal_code = models.CharField(max_length=128)
    gender = models.CharField(max_length=128)
    date_of_birth = models.CharField(max_length=128)
    image_url = models.URLField()
    phone = models.CharField(max_length=20)




class Card(models.Model):
    user_email = models.EmailField(unique=True)
    card_number = models.CharField(max_length=16)
    expiry_date = models.DateField()
    cvv = models.CharField(max_length=3)
    address = models.CharField(max_length=128)
    type_card = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)

class Withdraw(models.Model):
    credit = models.CharField(max_length=128)
    amount = models.DecimalField(max_digits=20, decimal_places=.2)
    currency = models.CharField(max_length=128)
    description = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)


class Pay(models.Model):
    to = models.CharField(max_length=128)
    amount = models.DecimalField(max_digits=20, decimal_places=.2)
    currency = models.CharField(max_length=128)
    description = models.CharField(max_length=128)



class Bill(models.Model):
    user_email = models.EmailField()
    title = models.CharField(max_length=128)
    description = models.TextField()
    to = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)



class Item(models.Model):
    bill = models.ForeignKey(Bill, related_name='items', on_delete=models.CASCADE)
    title = models.CharField(max_length=128)
    price = models.DecimalField(max_digits=20, decimal_places=2)
    currency = models.CharField(max_length=128)