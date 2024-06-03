import React from "react";
import './Balance.scss';
import Button from "./Button";
import Card from '../assets/Card.svg';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

function Balance({Balance = 0}) {
    const { t, i18n } = useTranslation();
    return (
        <div className="balance">
            <h1>{t('Balance')}</h1>
            <h2>${Balance}</h2>
            <Link to='/withdraw'><Button text={t('Withdraw')}/></Link>
        </div>
    );
}

export default Balance;