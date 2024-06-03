import React, { useState, useEffect } from 'react';
import './Settings.scss';
import Nav_Top from '../components/Nav_Top';
import Button from '../components/Button';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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

const ConfirmAlert = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff3cd; /* Light yellow background */
    color: #856404; /* Dark yellow text */
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

const AlertButton = styled.button`
    background-color: ${props => props.confirm ? '#155724' : '#721c24'};
    color: #fff; /* White text */
    border: none;
    padding: 5px 10px;
    margin: 5px;
    border-radius: 4px;
    cursor: pointer;
`;

const OkButton = styled.button`
    background-color: #155724; /* Dark green background */
    color: #fff; /* White text */
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
`;

function Settings() {
    const [selectedOption, setSelectedOption] = useState("en"); // Default selected option
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [phone, setPhone] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState('');

    const handleOptionChange = (e) => {
        const lang = e.target.value;
        setSelectedOption(lang);
        i18n.changeLanguage(lang); // Change language
    };

    useEffect(() => {
        setSelectedOption(i18n.language); // Update selected option when language changes
    }, [i18n.language]);

    const handleChangePassword = async () => {
        try {
            // Check if new password and confirm password match
            if (newPassword !== confirmPassword) {
                setErrorMessage("New password and confirm password do not match.");
                return;
            }
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+}{"':;?/><.,-]).{8,}$/;
            if (!passwordRegex.test(newPassword)) {
                setErrorMessage('Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character.');
                return;
            }

            const token = localStorage.getItem('token');
            const response = await fetch('https://localhost:8000/api/change_password/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    old_password: oldPassword, // Add old password to request body
                    new_password: newPassword
                })
            });

            if (response.ok) {
                setErrorMessage('');
                setPassword('');
                setNewPassword('');
                setConfirmPassword('');
                // Show success message or perform other actions upon successful password change
                setSuccessMessage('Password changed successfully');
            } else {
                const data = await response.json();
                setErrorMessage(data.error);
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setErrorMessage('An error occurred. Please try again later.');
        }
    };

    const handlePhone = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch('https://localhost:8000/api/update_phone/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                phone: phone,
            })
        });
        if (response.ok) {
            setPhone('');
            setSuccessMessage("Phone added successfully");
        } else {
            const data = await response.json();
            setErrorMessage(data.error);
        }
    };

    const handleRemoveAccount = async () => {
        setShowConfirm(true);
    };

    const confirmRemoveAccount = async () => {
        setShowConfirm(false);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://localhost:8000/api/remove_account/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.ok) {
                // Clear the token and userId from localStorage
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                navigate('/');
                setSuccessMessage('Account removed successfully');
                // Redirect or perform other actions after account removal
            } else {
                const data = await response.json();
                setErrorMessage(data.error);
            }
        } catch (error) {
            console.error('Error removing account:', error);
            setErrorMessage('An error occurred. Please try again later.');
        }
    };

    const handleOkClick = () => {
        setErrorMessage('');
        setSuccessMessage('');
    };

    const handleCancelClick = () => {
        setShowConfirm(false);
    };

    const ForgetPassword = () => {
        setSuccessMessage("Sent new password to your email");
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        // Only allow numbers and the + character
        if (/^[0-9+]*$/.test(value)) {
            setPhone(value);
        }
    };

    return (
        <div className='settings'>
            <Nav_Top buttonText={t('GobackDashboard')} page={t('Settings')} />
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
            {showConfirm && (
                <ConfirmAlert>
                    <p>Are you sure you want to remove your account? This action cannot be undone.</p>
                    <div>
                        <AlertButton confirm onClick={confirmRemoveAccount}>Confirm</AlertButton>
                        <AlertButton onClick={handleCancelClick}>Cancel</AlertButton>
                    </div>
                </ConfirmAlert>
            )}
            <div className='content'>
                <div className='right-settings'>
                    <div className='top'>
                        <h1>{t('ChangePassword')}</h1>
                        <input type='password' placeholder={t('Password')} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                        <input type='password' placeholder={t('NewPassword')} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        <input type='password' placeholder={t('ConfirmPassword')} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        <div className='row-settings'>
                            <Button text={t('Save')} onclick={handleChangePassword} />
                            <Button text={t('ForgetPassword')} onclick={ForgetPassword} />
                        </div>
                    </div>
                    <div className='down-settings'>
                        <h1>{t('Phone')}</h1>
                        <input
                            type='tel'
                            placeholder={t('EnterPhone')}
                            value={phone}
                            onChange={handlePhoneChange}
                            pattern="[0-9+]*"
                            title="Phone number should contain only numbers and '+'"
                        />
                        <Button text={t('Confirm')} onclick={handlePhone} />
                    </div>
                </div>
                <div className='left-settings'>
                    <h1>{t('Notifications')}</h1>
                    <div className="form-check form-switch" id='row'>
                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">{t('Newsandupdates')}</label>
                        <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                    </div>
                    <h1 id='lang'>{t('Languages')}</h1>
                    <select value={selectedOption} onChange={handleOptionChange} className='lang'>
                        <option value="en">{t('English')}</option>
                        <option value="ar">{t('Arabic')}</option>
                    </select>
                    <h1>{t('Account')}</h1>
                    <Button text={t('CloseAccount')} onclick={handleRemoveAccount} />
                </div>
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
    );
}

export default Settings;
