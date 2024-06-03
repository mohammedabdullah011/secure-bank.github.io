import React, { useState, useEffect } from 'react';
import Nav_Top from '../components/Nav_Top';
import Notifi from '../components/Notifi';
import './Notifications.scss';
import { useTranslation } from 'react-i18next';

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { t, i18n } = useTranslation();
    

    useEffect(() => {
        // Fetch notification data from the backend API
        fetchNotifications();
    }, []); // Empty dependency array ensures this effect runs only once on component mount

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            // Make an HTTP GET request to the backend API
            const response = await fetch('https://localhost:8000/api/get_notifications/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Parse the response body as JSON
                const data = await response.json();
                // Update state with the retrieved notifications
                setNotifications(data);
            } else {
                throw new Error('Failed to fetch notifications');
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setError('Error fetching notifications');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='notifications'>
            <Nav_Top buttonText={t('GobackDashboard')} page={t('Notifications')} />
            <div className='content'>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : (
                    notifications.map((notification, index) => (
                        <Notifi
                            key={index}
                            title={notification.title}
                            date={notification.date}
                            message={notification.message}
                            
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default Notifications;