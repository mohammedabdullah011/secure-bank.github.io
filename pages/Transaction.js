import Item from '../components/Item';
import Nav_Dashboard from '../components/Nav_Dashboard';
import Nav_Top from '../components/Nav_Top';
import './Transaction.scss';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


function Transaction({  }) {



        const location = useLocation();
        const params = new URLSearchParams(location.search);
        const { t, i18n } = useTranslation();
    
        const date = params.get('date');
        const description = params.get('description');
        const amount = params.get('amount');
        const from = params.get('from');
        const to = params.get('to');
        const type = params.get('type');
        const currency = params.get('currency') || 'USD';

    return (
        <div className='transaction'>
           
            <Nav_Top buttonText={t('GobackTransactions')} page={t('TransactionInfo')} link='/transactions'/>
            <div className='content'>
                <div className='top'>
                    <div className='first'>
                        <h1>
                            {t('Date')}: {date}
                        </h1>
                        <h1>
                            {t('From')}: {from}
                        </h1>

                    </div>
                    <div className='middel'>
                        <h1>
                            {t('Type')}: {type}
                        </h1>
                        <h1>
                            {t('To')}: {to}
                        </h1>

                    </div>
                    <div className='end'>
                        <h1>
                            {t('Status')}
                        </h1>
                        <button > {t('Done')} </button>

                    </div>
                </div>
                <div className='middel'>
                    <p>
                        {description}
                    </p>
                    <div className='price'>
                        <h1 className='h1'>
                            {`${t('Total')}`}
                        </h1>
                        <h1 className='h2'>
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency:currency }).format(amount)}
                        </h1>
                    </div>
                </div>
                

            </div>
        </div>
    )
}

export default Transaction;