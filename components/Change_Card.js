import React from "react";
import './Change_Card.scss';
import Button from "./Button";
import Card from '../assets/Card.svg';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

function Change_Card({CardID='XXXXXXXXXXXXXXXXXXXXXXXXXXXX', Currency='USD', Status='Active'}) {
    const { t, i18n } = useTranslation();
    return (
        <div className="change-card">
            <img src={Card} />
            <div className="text-head-change-card">
                <h1>{t('CardID')}:</h1>
                <h2>{CardID}</h2>
            </div>

            <div className="row-change-card">
                <div className="right-row-change-card">
                    <h1>{t('Currency')}:</h1>
                    <h2>{Currency}</h2>
                </div>
                <div className="left-row-change-card">
                    <h1>{t('Status')}:</h1>
                    <h2>{Status}</h2>
                </div>
            </div>
            <Link to='/add-card'><Button text={t('ChangeCard')} /></Link>
        </div>
    );
}

export default Change_Card;