import React, { useState, useEffect } from 'react';
import './Payment.scss';
import Nav_Dashboard from '../components/Nav_Dashboard';
import Nav_Top from '../components/Nav_Top';
import Icon_Profile from '../components/Icon_Profile';
import Img from '../assets/profile.jpg';
import Info_Item from '../components/Info_Item';
import Pers_Info from '../components/Pers_Info';
import Address from '../components/Address';
import Change_Card from '../components/Change_Card';
import Balance from '../components/Balance';
import Latest_Trans from '../components/Latest_Trans';
import { useTranslation } from 'react-i18next';


function Payment() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { t, i18n } = useTranslation();
    const [profitData, setProfitData] = useState({
        withdraw_all: 0,
        pay_all: 0,
        balance: 0,
        profit: 0
    });

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


    useEffect(() => {
        const fetchProfitData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('https://localhost:8000/api/get_profit', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setProfitData(data);
                } else {
                    throw new Error('Failed to fetch profit data');
                }
            } catch (error) {
                console.error('Error fetching profit data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfitData();
    }, []);



    if (loading) {
        return <div className="loading">
        <div className="spinner"></div>
        <div>Loading...</div>
    </div>
    
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='payment'>
           
            <div className='content-payment-new'>
                <div className='right-payment-new'>
                    {userData && (
                        <Change_Card
                            CardID={userData[1].card_number}
                            Currency='USD'
                            Status='Active'
                        />
                    )}
                </div>

                <div className='left-payment-new'>
                    <Balance Balance={profitData.balance}/>
                    <Latest_Trans />
                </div>
            </div>
        </div>
    );
}

export default Payment;
