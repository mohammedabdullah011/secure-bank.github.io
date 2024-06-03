import React, { useState, useEffect } from 'react';
import './Edit_Profile.scss';
import Nav_Dashboard from '../components/Nav_Dashboard';
import Nav_Top from '../components/Nav_Top';
import ChangeProfile from '../components/ChangeProfile';
import Button from '../components/Button';
import { useLocation } from 'react-router-dom';
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



function Edit_Profile() {
    const location = useLocation(); // Get the location object
    const { selectedImage } = location.state || {}; // Destructure selectedImage from the location state
    const initialFormData = {
        first_name: '',
        last_name: '',
        bio: '',
        country: '',
        city: '',
        postal_code: '',
        gender: '',
        date_of_birth: '',
        taxID: '',
        image_url: selectedImage || '', // Set the initial value of image_url to selectedImage
    };
    const [formData, setFormData] = useState(initialFormData);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { t, i18n } = useTranslation();

    useEffect(() => {
        if (selectedImage) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                image_url: selectedImage,
            }));
        }
    }, [selectedImage]); // Update the formData when selectedImage changes


    
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Limit input length for taxID field
        if (name === 'taxID' && value.length > 16) {
            return; // Do not update the state if the input length exceeds 9 characters
        }


        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));

        // Update image_url if the input type is file
        if (e.target.type === 'file') {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setFormData((prevFormData) => ({
                ...prevFormData,
                image_url: imageUrl,
            }));
        }
    };

    const calculateAge = (dateOfBirth) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        const age = calculateAge(formData.date_of_birth);
        if (age < 12) {
            setErrorMessage('You must be at least 12 years old');
            return;
        }
        try {
            if (/^\d+$/.test(formData.first_name) || /^\d+$/.test(formData.last_name)) {
                setErrorMessage("Please fill valid name");
                return;
            }
    
            if (formData.image_url) {
                const token = localStorage.getItem('token');
                const response = await fetch('https://localhost:8000/api/edit_profile/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(getChangedFields(formData, initialFormData)),
                });
    
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setFormData(initialFormData);
                    setSuccessMessage("Your information is Updated");
                    // Optionally, handle success response
                } else {
                    setErrorMessage('Failed to update profile');
                }
                if(!formData.bio || !formData.city || !formData.country || !formData.date_of_birth || !formData.first_name || !formData.gender || !formData.last_name || !formData.postal_code || !formData.taxID){
                    setErrorMessage("Please Fill All Fields")
                }
            } else {
                const token = localStorage.getItem('token');
                const response = await fetch('https://localhost:8000/api/edit_profile/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(getChangedFields(formData, initialFormData)),
                });
    
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setFormData(initialFormData);
                    setSuccessMessage("Your information is Updated");
                    // Optionally, handle success response
                } else {
                    setErrorMessage('Failed to update profile');
                }
            }
        } catch (error) {
            setErrorMessage('Error updating profile:', error);
            // Optionally, handle error
        }
    };
    
    // Function to get changed fields from the form data
    const getChangedFields = (formData, initialFormData) => {
        const changedFields = {};
        for (const key in formData) {
            if (formData[key] !== initialFormData[key]) {
                changedFields[key] = formData[key];
            }
        }
        return changedFields;
    };
    
    const handleDateOfBirthChange = (e) => {
        const value = e.target.value;
        // Check if the date of birth is not empty
        if (value.trim() === '') {
            setErrorMessage('Please enter your date of birth.');
        } else {
            // Check if the date of birth matches the pattern YYYY-MM-DD
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(value)) {
                setErrorMessage('Please enter a valid date in the format YYYY-MM-DD.');
            } else {
                // Date of birth is valid, update the form data
                setFormData({
                    ...formData,
                    date_of_birth: value
                });
                // Clear any existing error message
                setErrorMessage('');
            }
        }
    };

    const handleCancel = () => {
        setFormData(initialFormData);
    };


    const handleOkClick = () => {
        setErrorMessage('');
        setSuccessMessage('');
    };

    return (
        <div className='edit-profile' >

            <Nav_Top buttonText={t('GobackProfile')} page={`${t('Edit')} ${t('Profile')}`} link='/profile' />
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
                <div className='right-edit'>
                    <ChangeProfile />
                    <div className='row-edit-profile'>
                        <div className='right-right'>
                            <h1>{t('FirstName')}</h1>
                            <input type='text' name='first_name' maxLength={30} value={formData.first_name} onChange={handleChange} />
                        </div>
                        <div className='left'>
                            <h1>{t('LastName')}</h1>
                            <input type='text' name='last_name' maxLength={30} value={formData.last_name} onChange={handleChange} />
                        </div>
                    </div>
                    <div className='mid'>
                        <h1>{t('Bio')}</h1>
                        <input type='text' name='bio' maxLength={50} value={formData.bio} onChange={handleChange} />
                    </div>
                    <div className='end-edit'>
                        <div className='first'>
                            <h1>{t('Country')}</h1>
                            <input type='text' name='country' maxLength={30} value={formData.country} onChange={handleChange} />
                        </div>
                        <div className='second'>
                            <h1>{t('City')}</h1>
                            <input type='text' name='city' maxLength={30} value={formData.city} onChange={handleChange} />
                        </div>
                        <div className='third'>
                            <h1>{t('PostalCode')}</h1>
                            <input type='text' name='postal_code' maxLength={30} value={formData.postal_code} onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div className='left-left'>
                    <div className='top'>
                        <h1>{t('Gender')}</h1>
                        <input type='text' name='gender' value={formData.gender} onChange={handleChange} />
                    </div>
                    <div className='mid-edit'>
                        <div className='first'>
                            <h1>{t('DateofBirth')}</h1>
                            <input type='date'
                                name='date_of_birth'
                                placeholder='Date of Birth (YYYY-MM-DD)'
                                value={formData.date_of_birth}
                                onChange={handleDateOfBirthChange}
                                pattern="\d{4}-\d{2}-\d{2}"
                                title="Please enter a date in the format YYYY-MM-DD"
                                style={{ width: '20vw' }} />
                        </div>
                    </div>
                    <div className='end'>
                        <h1>{t('TaxID')}</h1>
                        <input type='number' name='taxID' value={formData.taxID} onChange={handleChange} maxLength={9}/>
                    </div>
                    <div className='button-end'>
                        <Button text={t('Save')} onclick={handleSubmit} />
                        <Button text={t('Cancel')} onclick={handleCancel} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Edit_Profile;
