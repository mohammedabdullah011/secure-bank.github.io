import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Item from '../components/Item';
import Nav_Top from '../components/Nav_Top';
import './Billing_Received.scss';
import { useTranslation } from 'react-i18next';



function Billing_Received() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const { t, i18n } = useTranslation();

    const date = params.get('date');
    const from = params.get('from');
    const title = params.get('title');
    const to = params.get('to');
    const status = params.get('status');  // 'Status' should be 'status' to match the param case
    const description = params.get('description');
    const total = parseFloat(params.get('total')) || 0;
    const items = JSON.parse(params.get('items')) || [];
    const currency = params.get('currency') || 'USD';  // Default to USD if not provided
    const USD_TO_EUR_RATE = 0.92;
    const USD_TO_EGP_RATE = 46.90;

    const [totalUSD, setTotalUSD] = useState(0);

    useEffect(() => {
        calculateTotalUSD();
    }, []); // Run once when component mounts

    const calculateTotalUSD = () => {
        let total = 0;
        items.forEach(item => {
            let price;
            if (item.currency === 'EUR') {
                price = item.price / USD_TO_EUR_RATE;
            } else if (item.currency === 'EGP') {
                price = item.price / USD_TO_EGP_RATE;
            } else {
                price = item.price;
            }
            total += price;
        });
        setTotalUSD(total);
    };

    return (
        <div className='billing-received'>
            <Nav_Top buttonText={t('GobackBills')} page={t('Bill')} link='/bills'/>
            <div className='content'>
                <div className='top'>
                    <div className='first'>
                        <h1>{t('Date')}: {date}</h1>
                        <h1>{t('From')}: {from}</h1>
                    </div>
                    <div className='middel'>
                        <h1>{t('Title')}: {title}</h1>
                        <h1>{t('To')}: {to}</h1>
                    </div>
                    <div className='end'>
                        <h1>{t('Status')}: {t('Done')}</h1>
                    </div>
                </div>
                <div className='middel'>
                    <p className='mid-des'>{description}</p>
                    <div className='price'>
                        <h1 className='h1'>{t('Total')}</h1>
                        <h1 className='h2'>${totalUSD.toFixed(2)}</h1>
                    </div>
                </div>
                <div className='end'>
                    {items.map((item, index) => (
                        <div key={index}>
                            <Item head1={item.title} price={new Intl.NumberFormat('en-US', { style: 'currency', currency: item.currency }).format(item.price)} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Billing_Received;
