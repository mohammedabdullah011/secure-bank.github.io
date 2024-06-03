import React, { useState } from 'react';
import './Address.scss';
import Nav_Dashboard from './Nav_Dashboard';
import Nav_Top from './Nav_Top';
import Personal_Info from './Icon_Profile';
import Img from '../assets/profile.png';
import Button from './Button';
import { useTranslation } from 'react-i18next';

function Address({Country='Egypt', City='Giza', Postal='00000', Tax='XXXXXXXXXXXXX'}) {

    const { t, i18n } = useTranslation();
    return (
        <div className='address'>
            <h1>{t('Address')}</h1>
            <div className='content-address'>
                <div className='top-address'>
                    <div className='first'>
                        <h1>{t('Country')}</h1>
                        <h2>{Country}</h2>
                    </div>
                    <div className='second'>
                        <h1>{t('City')}</h1>
                        <h2>{City}</h2>
                    </div>
                </div>
                <div className='mid-address'>
                <div className='first'>
                        <h1>{t('PostalCode')}</h1>
                        <h2>{Postal}</h2>
                    </div>
                    <div className='second'>
                        <h1>{t('TaxID')}</h1>
                        <h2>{Tax}</h2>
                    </div>
                </div>
        </div>
        </div>
    );
}

export default Address;