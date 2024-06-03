import React, { useState } from 'react';
import Navigation_bar from '../components/Navigation';
import './Contact.scss';
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
    background-color: #f8d7da; /* Light red background */
    color: #721c24; /* Dark red text */
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

const OkButton = styled.button`
    background-color: #155724; /* Dark green background */
    color: #fff; /* White text */
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
`;

function Contact() {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
        message: '',
        email: '',
        name: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://localhost:8000/api/submit_contact_form/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                setSuccessMessage(data.success);
                setFormData({
                    message: '',
                    email: '',
                    name: '',
                });
            } else {
                setErrorMessage(data.error);
            }
        } catch (error) {
            setErrorMessage('An error occurred. Please try again later.');
        }
    };

    const handleOkClick = () => {
        setErrorMessage('');
        setSuccessMessage('');
    };

    return (
        <div className='mkkkkkkkk'>
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
            <div className='contactUs'>
                <form className='contact' onSubmit={handleSubmit}>
                    <textarea
                        type='text'
                        id='message'
                        name='message'
                        placeholder='Hi, write your message.'
                        minLength={20}
                        required
                        autoComplete='on'
                        value={formData.message}
                        onChange={handleChange}
                    />
                    <input
                        type='email'
                        id='email'
                        name='email'
                        placeholder='Email...'
                        required
                        autoComplete='on'
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <div className='bottom-contact'>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            placeholder='Name...'
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <button className='contact-button' type='submit'>
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Contact;
