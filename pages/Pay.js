import React, { useState } from 'react';
import './Pay.scss';
import Nav_Top from '../components/Nav_Top';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
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




function Pay() {
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [description, setDescription] = useState("");
    const [to, setTo] = useState("");
    const [isPay, setIsPay] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { t, i18n } = useTranslation();

    

    const handleToChange = (e) => {
        setTo(e.target.value);
    };

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    const handleCurrencyChange = (e) => {
        setCurrency(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handlePay = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!to || !amount || amount <= 0) {
                if (!to){
                    setErrorMessage('Please Fill To');
                }else if (!amount){
                    setErrorMessage("Please Fill Amount");
                }else if (amount == 0) {
                    setErrorMessage("Zero value is not correct, please fill correct Value");
                }else if (amount < 0) {
                    setErrorMessage("Minus value is not correct, please fill correct Value")
                }else {
                    setErrorMessage("Please fill Amount Field");
                }
                return; // Exit the function if required fields are not filled or amount is 0 or negative
            }
            
            const response = await fetch('https://localhost:8000/api/pay/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: to,
                    amount: amount,
                    currency: currency,
                    description: description
                })
            });

            if (response.ok) {
                setIsPay(true);
                setAmount("");
                setDescription("");
                setCurrency("USD");
                setSuccessMessage("Pay successful");
                // Fetch updated user data after successful withdrawal

            } else {
                const data = await response.json();

                    setErrorMessage('Error: ' + data.error);
                
            }
        } catch (error) {
            setErrorMessage('Error paying funds: ' + error);
        }
    };


    const handleCancel = () => {
        setIsPay(false);
        setAmount("");
        setDescription("");
        setTo(""); // Reset the 'to' field if needed
        setCurrency("USD"); // Reset the currency to default if needed
    };

    const handleOkClick = () => {
        setErrorMessage('');
        setSuccessMessage('');
    };
    
    return (
        <div className='pay'>
            <Nav_Top buttonText={t('GobackTransactions')} page={t('Pay')} link='/transactions' />
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
            <div className='content'>
                <div className='right'>
                    <h1>{t('To')}</h1>
                    <input type='email' placeholder={t('Enteremail')} name='to' value={to} onChange={handleToChange}/>
                    <h1>{t('Amount')}</h1>
                    <input type='number' min={0} maxLength={6} name='amount' value={amount} onChange={handleAmountChange}/>
                    <h1>{t('Currency')}</h1>
                    <select value={currency} name='currency' onChange={handleCurrencyChange}>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="EGP">EGP</option>
                    </select>
                </div>
                <div className='left'>
                    <h1>{t('Description')}</h1>
                    <textarea
                        className='message-input'
                        rows={10} // Set the number of visible row
                        maxLength={1500} // Optional: Set maximum character limit
                        onChange={handleDescriptionChange}
                        name='description'
                        value={description}
                    />
                    <div className='row-pay'>
                        <Button text={t('Confirm')} onclick={handlePay}/>
                        <Button text={t('Cancel')} onclick={handleCancel}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pay;
