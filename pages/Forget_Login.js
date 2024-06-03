import Button from '../components/Button';
import './Forget_Login.scss';
import React from 'react';
import logo from '../assets/logo.svg';
import transaction from '../assets/transactions.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useState } from 'react';
import axios from 'axios';
import { getAuth, signInWithCustomToken } from "firebase/auth";
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





function Forget_Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = getAuth();
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {


        setSuccessMessage('The Code is send successful')
        setEmail('');
    };


    const handleOkClick = () => {
        setErrorMessage('');
        setSuccessMessage('');
    };



    return (
        <div className='login-page'>
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
            <div className='content-login-page'>
                <div className='right-login-page'>
                    <div className='top-login-page'>
                        <img src={logo} />
                        <h1>Welcome Back</h1>
                        <div className='input-login-page'>
                            <h1>Email Address</h1>
                            <input type='email' name='email' value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                    </div>
                    <Button text='Send Code' onclick={handleLogin} />
                    <div className='line-login-page'></div>
                    <h1><Link to={'/login'} className='sign-link'>Login</Link></h1>
                    <h1>Don't have an account? <Link to={'/sign-up'} className='sign-link'>Sign up</Link></h1>
                </div>
                <div className='left-login-page' style={{ backgroundImage: `url(${transaction})` }}></div>


            </div>
        </div>
    );
}

export default Forget_Login;