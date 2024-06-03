import React, { useState, useEffect } from 'react';
import './Profile.scss';
import Nav_Dashboard from '../components/Nav_Dashboard';
import Nav_Top from '../components/Nav_Top';
import Icon_Profile from '../components/Icon_Profile';
import Img from '../assets/profile.jpg';
import Info_Item from '../components/Info_Item';
import Pers_Info from '../components/Pers_Info';
import Address from '../components/Address';
import { useTranslation } from 'react-i18next';

function Profile(){
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
            setError(error.message);
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

    return(
        <div className='my-profile'>
            
            <Nav_Top buttonText={t('GobackDashboard')} page={t('MyProfile')} />
            <div className='content-profile'>
                <Info_Item  Name={userData[0].first_name + " " +userData[0].last_name} Bio={userData[0].bio} Address={userData[0].country + " " +userData[0].city} Image={Img}/>
                <Pers_Info  FirstName={userData[0].first_name} LastName={userData[0].last_name} Email={userData[0].email} Phone={userData[0].phone} Bio={userData[0].bio}/>
                <Address Country={userData[0].country} City={userData[0].city} Postal={userData[0].postal_code} Tax={userData[0].taxID} />
            </div>
        </div>
    );
}

export default Profile;