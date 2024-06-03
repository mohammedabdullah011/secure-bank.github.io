// Notification.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import Nav_Top from '../components/Nav_Top';
import './Notification.scss';
import { useTranslation } from 'react-i18next';

function Notification() {

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const { t, i18n } = useTranslation();
    
    const date = params.get('date');
    const message = params.get('message');
    const title = params.get('title');


    return (
        <div className='notification'>
            <Nav_Top buttonText={t('GoBackNotifications')} page={t('NotificationInfo')} link='/notifications'/>
            <div className='content'>
                <h1>{title}</h1>
                <p>{message}</p>
                <h2>{t('Date')}: {date}</h2>
            </div>
        </div>
    );
}

export default Notification;
