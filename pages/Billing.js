import React, { useState } from 'react';
import Nav_Top from '../components/Nav_Top';
import './Billing.scss';
import Item_Bill from '../components/Item_Bill';
import Button from '../components/Button';
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
        width: 100%; /* Ensure the paragraph takes full width of the container */
        word-wrap: break-word; /* Allow long words to wrap to the next line */
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
    background-color: #f8d7da; /* Light red background */
    color: #721c24; /* Dark red text */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 30%;
    align-items: center;
    p {
        width: 100%; /* Ensure the paragraph takes full width of the container */
        word-wrap: break-word; /* Allow long words to wrap to the next line */
    }
`;

const OkButton = styled.button`
    background-color: #155724; /* Dark green background */
    color: #fff; /* White text */
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
`;

function Billing() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [to, setTo] = useState("");
    const [items, setItems] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { t, i18n } = useTranslation();

    const addItem = () => {
        if (items.every(item => item.title && item.price && item.currency)) {
            setItems([...items, { title: '', price: '', currency: 'USD' }]);
            setErrorMessage(''); // Clear any previous error messages
        } else {
            setErrorMessage('Please fill all item details before adding a new item.');
        }
    };

    const handleTitleChange = (index, value) => {
        const updatedItems = [...items];
        updatedItems[index].title = value;
        setItems(updatedItems);
    };

    const handlePriceChange = (index, value) => {
        const updatedItems = [...items];
        updatedItems[index].price = value;
        setItems(updatedItems);
    };

    const handleCurrencyChange = (index, value) => {
        const updatedItems = [...items];
        updatedItems[index].currency = value;
        setItems(updatedItems);
    };

    const sendBill = () => {
        if (!title || !description || !to) {
            setErrorMessage("Please fill in all required fields (Title, Description, To)");
            return;
        }

        if (description.length < 10) {
            setErrorMessage("Description must be at least 10 characters long.");
            return;
        }

        if (items.length === 0) {
            setErrorMessage("Please add at least one item.");
            return;
        }

        if (!items.every(item => item.title && item.price && item.currency)) {
            setErrorMessage("Please fill all details for each item.");
            return;
        }

        const token = localStorage.getItem('token');
        const billData = {
            title: title,
            description: description,
            to: to,
            items: items
        };

        fetch('https://localhost:8000/api/create_bill/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(billData),
        })
        .then(async response => {
            const data = await response.json();
            if (!response.ok) {
                if (data.error.includes("email")) {
                    setErrorMessage('Error: ' + data.error);
                    return;
                }
                setErrorMessage('Error: ' + data.error);
                return; // Exit early if there was an error
            }
            setSuccessMessage('Bill sent successfully');
            // Reset input fields to their default values
            setTitle("");
            setDescription("");
            setTo("");
            setItems([]);
        })
        .catch(error => {
            setErrorMessage('Error sending bill: ' + error.message);
        });
    };

    const handleOkClick = () => {
        setErrorMessage('');
        setSuccessMessage('');
    };

    return (
        <div className='billing'>
            <Nav_Top page={t('Billing')} buttonText={t('GobackBills')} link='/bills'/>
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
                    <div className='top'>
                        <h1>{t('Title')}</h1>
                        <input
                            className='title'
                            type='text'
                            maxLength={30}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className='down'>
                        {items.map((item, index) => (
                            <Item_Bill
                                key={index}
                                title={item.title}
                                price={item.price}
                                currency={item.currency}
                                onTitleChange={(value) => handleTitleChange(index, value)}
                                onPriceChange={(value) => handlePriceChange(index, value)}
                                onCurrencyChange={(value) => handleCurrencyChange(index, value)}
                            />
                        ))}
                        <Button text={t('AddNewItem')} onclick={addItem}/>
                    </div>
                </div>
                <div className='left'>
                    <h1>{t('Description')}</h1>
                    <textarea
                        className='message-input'
                        rows={10}
                        maxLength={1500}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <h1>{t('To')}</h1>
                    <input
                        className='to'
                        type='email'
                        maxLength={90}
                        placeholder={t('Enteremail')}
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                    />
                    <Button text={t('Send')} onclick={sendBill}/>
                </div>
            </div>
        </div>
    );
}

export default Billing;
