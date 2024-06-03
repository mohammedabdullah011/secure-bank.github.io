import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import './Sign_up.scss';
import logo from '../assets/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
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






function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    else return null; // Return null if cookie not found
}


function Sign_Up() {
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        bio: '',
        country: '',
        city: '',
        postal_code: '',
        taxID: '',
        

    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateEmail = (email) => {
        // Regular expression for validating email format
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSignup = async () => {

        if (!validateEmail(formData.email)) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+}{"':;?/><.,-]).{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            setErrorMessage('Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character.');
            return;
        }

        // Check if any required field is empty
        if (!formData.email || !formData.password || !formData.first_name || !formData.last_name || !formData.bio || !formData.city || !formData.country || !formData.taxID || !formData.postal_code) {
            setErrorMessage('Please fill in all required fields.');
            return;
        }

        if (/^\d+$/.test(formData.first_name) || /^\d+$/.test(formData.last_name)) {
            setErrorMessage("Please fill valid name");
            return;
        }
        if (/^\d+$/.test(formData.bio)) {
            setErrorMessage("Please fill valid Bio");
            return;
        }
        if (/^\d+$/.test(formData.country)) {
            setErrorMessage("Please fill valid Country");
            return;
        }
        if (/^\d+$/.test(formData.city)) {
            setErrorMessage("Please fill valid City");
            return;
        }
        // Retrieve CSRF token from cookie
        const csrftoken = getCookie('csrftoken');




        try {
            const response = await fetch('https://localhost:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,

                },

                body: JSON.stringify(formData),

            });

            if (response.ok) {
                const data = await response.json();


                // Save the token to local storage or session storage

                setSuccessMessage("Account created successfully");
                            // Navigate after a delay
                setTimeout(() => {
                    navigate('/add-card-sign', { state: { user_email: formData.email } });
                }, 3000); // Delay of 2 seconds (2000 milliseconds)

                // Redirect or show a success message
            } else {
                const data = await response.json();
                setErrorMessage(data.error);
            }
        } catch (error) {
            console.error('Error:', error);

        }
    };

    const handleOkClick = () => {
        setErrorMessage('');
        setSuccessMessage('');
    };
    



    return (
        <div className='sign-page'>
            <div className='cont-sign-page'>
                <div className='right-sign-page'>
                    <div className='top-sign-page'>
                        <img src={logo} alt="Logo" />
                        <h1>Welcome to Secure bank</h1>
                        <h2>Register your account</h2>
                    </div>
                    <div className='mid-sign-page'>
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

                        <div className='right-sign-page'>
                            <h1>First Name</h1>
                            <input type='text' name="first_name" value={formData.first_name} onChange={handleChange} required />
                        </div>
                        <div className='left-sign-page'>
                            <h1>Last Name</h1>
                            <input type='text' name="last_name" value={formData.last_name} onChange={handleChange} />
                        </div>
                    </div>
                    <div className='input-sign-page'>
                        <h1>Email</h1>
                        <input type='email' name="email" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className='inputtwo-sign-page'>
                        <h1>Password</h1>
                        <input type='password' name="password" value={formData.password} onChange={handleChange} />
                    </div>
                </div>
                <div className='left-sign-page'>
                    <div className='top-left-sign-page'>
                        <div className='first-sign-page'>
                            <h1>Bio</h1>
                            <input type='text' name="bio" value={formData.bio} onChange={handleChange} />
                        </div>
                        <div className='second-sign-page'>
                            <div className='secondf-sign-page'>
                                <h1>Country</h1>
                                <input type='text' name="country" value={formData.country} onChange={handleChange} />
                            </div>
                            <div className='seconds-sign-page'>
                                <h1>City</h1>
                                <input type='text' name="city" value={formData.city} onChange={handleChange} />
                            </div>
                        </div>
                        <div className='third-sign-page'>
                            <h1>Postal Code</h1>
                            <input type='text' name="postal_code" value={formData.postal_code} onChange={handleChange} />
                        </div>
                        <div className='fourth-sign-page'>
                            <h1>Tax ID</h1>
                            <input type='text' name="taxID" value={formData.taxID} onChange={handleChange} />
                        </div>
                    </div>
                    <Button text='Create Account' onclick={handleSignup} />
                    <div className='line-line-line-sign'></div>
                    <Link to={'/login'} className='have'>Have you account already? Login</Link>
                </div>
            </div>
        </div>
    );
}

export default Sign_Up;
