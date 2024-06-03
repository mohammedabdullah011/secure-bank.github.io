import './Card_Dashboard.scss';
import React from 'react';
import Circle_Statistic from './Circle_Statistic';
import { useTranslation } from 'react-i18next';




function Card_Dashboard({NameCard='Withdraw', Price=200.00, Month=8, value=75, maxValue=100}){
    const { t, i18n } = useTranslation();
    return(
        <div className='card-dashboard'>
            <div className='right-card-dashboard'>
                <h1>{NameCard}</h1>
                <h2>${Price}</h2>
            </div>
            <div className='left-card-dashboard'>
                <h1>{t('Month')} {Month}</h1>
                <Circle_Statistic value={value} maxValue={maxValue} color='#ebe6e6' colorbg='#05D845'/>
            </div>
        </div>
    );
}

export default Card_Dashboard;