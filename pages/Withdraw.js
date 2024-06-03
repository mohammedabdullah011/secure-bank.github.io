import React, { useState, useEffect } from 'react';
import './Withdraw.scss';
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






function Withdraw() {
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [description, setDescription] = useState("");
    const [isWithdrawn, setIsWithdrawn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { t, i18n } = useTranslation();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://localhost:8000/api/get_user_data/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUserData(data);
            } else {
                throw new Error('Failed to fetch user data');
            }
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">
        <div className="spinner"></div>
        <div>Loading...</div>
    </div>
    
    }

    if (error) {
        return <div>Error: {error}</div>;
    }


    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    const handleCurrencyChange = (e) => {
        setCurrency(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleWithdraw = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!userData || !userData[1].card_number || !amount || amount <= 0) {
                if (amount == 0) {
                    setErrorMessage("Zero value is not correct, please fill correct Value");
                } else if (amount < 0) {
                    setErrorMessage("Minus value is not correct, please fill correct Value")
                } else {
                    setErrorMessage("Please fill Amount Field");
                }
                return; // Exit the function if required fields are not filled or amount is 0 or negative
            }
            
            const response = await fetch('https://localhost:8000/api/withdraw/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    credit: userData[1].card_number,
                    amount: amount,
                    currency: currency,
                    description: description
                })
            });

            if (response.ok) {
                setIsWithdrawn(true);
                setAmount("");
                setDescription("");
                setSuccessMessage("Withdrawal successful");
                // Fetch updated user data after successful withdrawal
                fetchUserData();
            } else {
                const data = await response.json();
                setErrorMessage(data.error);
            }
        } catch (error) {
            setErrorMessage('Error withdrawing funds:', error);
        }
    };

    const handleOkClick = () => {
        setErrorMessage('');
        setSuccessMessage('');
    };


    return (
        <div className='withdraw'>
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
            <Nav_Top buttonText={t('GobackDashboard')} page={t('Withdraw')} />
            <div className='content'>
                <div className='right'>
                    <h1>{t('CreditCard')}</h1>
                    <select className='credit' value={userData && userData[1].card_number} onChange={(e) => console.log(e.target.value)}>
                        {userData && userData[1].card_number && (
                            <option value={userData[1].card_number}>{userData[1].card_number}</option>
                        )}
                    </select>

                    <h1>{t('Amount')}</h1>
                    <input type='number' min={0} maxLength={6} value={amount} onChange={handleAmountChange} />
                    <h1>{t('Currency')}</h1>
                    <select value={currency} onChange={handleCurrencyChange}>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="EGP">EGP</option>
                    </select>
                </div>
                <div className='left'>
                    <h1>{t('Description')}</h1>
                    <textarea
                        className='message-input'
                        rows={10}
                        maxLength={1500}
                        value={description}
                        onChange={handleDescriptionChange}
                    />
                    <Button text={t('Confirm')} onclick={handleWithdraw} />
                </div>
            </div>
        </div>
    );
}

export default Withdraw;
