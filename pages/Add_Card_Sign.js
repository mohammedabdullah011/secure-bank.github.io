import React, { useState, useEffect } from 'react';
import './Add_Card_Sign.scss';
import Card from '../components/Card';
import Visa from '../assets/Visa.svg';
import Mastercard from '../assets/Mastercard.png'
import Button from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom'; // Import useLocation to access location state
import styled from 'styled-components';



const SuccessAlert = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #d4edda; /* Light green background */
    color: #155724; /* Dark green text */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 30%;
    align-items: center;
    p {
        width: 100%; // Ensure the paragraph takes full width of the container
        word-wrap: break-word; // Allow long words to wrap to the next line
    }
`;

const ErrorAlert = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #d4edda; /* Light green background */
    color: #155724; /* Dark green text */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 30%;
    align-items: center;
    p {
        width: 100%; // Ensure the paragraph takes full width of the container
        word-wrap: break-word; // Allow long words to wrap to the next line
    }
    `
;


const OkButton = styled.button`
    background-color: #155724; /* Dark green background */
    color: #fff; /* White text */
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
`;


function Add_Card_Sign(){

    const location = useLocation(); // Get location object to access state
    const { user_email } = location.state || {}; // Retrieve user's email from location state
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    
    const navigate = useNavigate();

    useEffect(() => {
        if (!user_email) {
            navigate('/login');
        }
    }, [user_email, navigate]);

    const [selectedCard, setSelectedCard] = useState(null);

    const handleCardSelect = (cardType) => {
        setSelectedCard(cardType);
    };

    const type_card = selectedCard;

    const [formData, setFormData] = useState({
        card_number: '',
        expiry_date: '',
        cvv: '',
        address: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddCard = async () => {
        try {
            if (!/^\d+$/.test(formData.card_number)) {
                setErrorMessage('Card number must contain only numbers.');
                return;
            }
            if (!/^\d+$/.test(formData.cvv)) {
                setErrorMessage('CVV must contain only numbers.');
                return;
            }

            if (/^\d+$/.test(formData.address)) {
                setErrorMessage('Address not Vaild');
                return;
            }
            // Check if all fields are filled
            if (!formData.address || !formData.card_number || !formData.cvv || !formData.expiry_date || !type_card){
                setErrorMessage("Please enter all fields.");
                return;
            }


            // Check card number length (16 for Visa and Mastercard)
            if (formData.card_number.length !== 16 && formData.card_number.length !== 19){
                setErrorMessage("Please enter a valid card number (16 or 19 digits).");
                return;
            }

            // Check CVV length (3 digits)
            if (formData.cvv.length !== 3){
                setErrorMessage("Please enter a valid CVV (3 digits).");
                return;
            }

            // Check if expiration date has passed
            const currentDate = new Date();
            const expiryDate = new Date(formData.expiry_date);
            if (expiryDate < currentDate) {
                setErrorMessage("The card has expired. Please use a valid card.");
                return;
            }

            // Include the user's email in formData
            const data = { ...formData, user_email, type_card };


            // Send a request to your API to add the card
            const response = await fetch('https://localhost:8000/api/add_card/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Card added successfully, navigate to another page or show a success message
                navigate('/login');
  
            } else {
                // Handle errors if any
                const data = await response.json();
                setErrorMessage(data.error);
            }
        } catch (error) {
            setErrorMessage('Error adding card:', error);
            // Handle errors
        }
    };

    const handleOkClick = () => {
        setErrorMessage('');
    };

    return(
        <div className='add-card-sign'>
            <h1 className='id'>Add Card</h1>
            <div className='content-add-card-sign'>
                <div className='right-add-card-sign'>
                    <div className='top-add-card-sign'>
                        <Card Title='Visa' Image={Visa} onSelect={handleCardSelect} />
                        <Card Title='Mastercard' Image={Mastercard} onSelect={handleCardSelect} />
                    </div>
                    {successMessage && (
                        <SuccessAlert>
                            <p>{successMessage}</p>
                            <OkButton onClick={handleOkClick}>OK</OkButton>
                        </SuccessAlert>
                    )}
                    {errorMessage && (
                        <ErrorAlert>
                            <p>{errorMessage}</p>
                            <OkButton onClick={handleOkClick}>OK</OkButton>
                        </ErrorAlert>
                    )}
                    <div className='down-add-card-sign'>
                        <div className='card-number-add-card-sign'>
                            <h1>Card Number</h1>
                            <input className='card-number' type='number' min="0" maxLength={30} name='card_number' onChange={handleChange}/>
                        </div>
                        <div className='row-add-card-sign'>
                            <div className='expire'>
                                <h1>Expiration Date</h1>
                                <input type='date' name='expiry_date' onChange={handleChange}/>
                            </div>
                            <div className='cvc'>
                                <h1>CVC</h1>
                                <input type='number' maxLength={5} min='0' name='cvv' onChange={handleChange}/>
                            </div>
                        </div>
                    </div>
                </div> 
                <div className='left-add-card-sign'>
                    <h1>Address</h1>
                    <input type='address' onChange={handleChange} name='address'/>
                    <Button text={'Confirm'} onclick={handleAddCard}/>
                </div>
            </div>
        </div>
    );
}

export default Add_Card_Sign;
