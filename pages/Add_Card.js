import React, { useState } from 'react';
import './Add_Card.scss';
import Nav_Dashboard from '../components/Nav_Dashboard';
import Nav_Top from '../components/Nav_Top';
import Card from '../components/Card';
import Visa from '../assets/Visa.svg';
import Mastercard from '../assets/Mastercard.png';
import Button from '../components/Button';
import { useLocation } from 'react-router-dom'; // Import useLocation to access location state
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';



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



function Add_Card() {

    const location = useLocation(); // Get location object to access state

    const [selectedCard, setSelectedCard] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { t, i18n } = useTranslation();

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
            const data = { ...formData, type_card };

            const token = localStorage.getItem('token');
            // Send a request to your API to add the card
            const response = await fetch('https://localhost:8000/api/update_card/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Reset form fields
                setFormData({
                    card_number: '',
                    expiry_date: '',
                    cvv: '',
                    address: '',
                });
                // Card added successfully, show a success message
                setErrorMessage('Card information updated successfully');
            } else {
                // Handle errors if any
                setErrorMessage('Failed to update card information');
            }
        } catch (error) {
            setErrorMessage('Error updating card information:', error);
            // Handle errors
        }
    };

    
    const handleOkClick = () => {
        setErrorMessage('');
        setSuccessMessage('');
    };

    return (
        <div className='add-card'>
            <Nav_Top buttonText={t('GobackPayment')} page={t('AddCard')} link='/payment' />
            <div className='content-add-card'>
                <div className='right-add-card'>
                    <div className='top-add-card'>
                        <Card Title={t('Visa')} Image={Visa} onSelect={handleCardSelect} />
                        <Card Title={t('Mastercard')} Image={Mastercard} onSelect={handleCardSelect} />
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
                    <div className='down-add-card'>
                        <div className='card-number-add-card'>
                            <h1>{t('CardNumber')}</h1>
                            <input className='card-number' value={formData.card_number} type='number' min="0" maxLength={30} name='card_number' onChange={handleChange} />
                        </div>
                        <div className='row-add-card'>
                            <div className='expire'>
                                <h1>{t('ExpirationDate')}</h1>
                                <input type='date' value={formData.expiry_date} name='expiry_date' onChange={handleChange} />
                            </div>
                            <div className='cvc'>
                                <h1>CVC</h1>
                                <input type='number' value={formData.cvv} maxLength={5} min='0' name='cvv' onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='left-add-card'>
                    <h1>{t('Address')}</h1>
                    <input type='address' value={formData.address} onChange={handleChange} name='address' />
                    <Button text={t('Confirm')} onclick={handleAddCard} /> {/* Corrected "onclick" to "onClick" */}
                </div>
            </div>
        </div>
    );
}

export default Add_Card;
