import React, { useState } from 'react';
import './Info_Item.scss';
import Nav_Dashboard from './Nav_Dashboard';
import Nav_Top from './Nav_Top';
import Icon_Profile from './Icon_Profile';
import Img from '../assets/profile.png';
import Button from './Button';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Info_Item({Name='Mohammed Abdullah', Bio='Software Engineer', Address='Giza,Egypt', Image={Img}}){
    const { t, i18n } = useTranslation();

    return(
        <div className='info-item'>
            <div className='right-info-item'>
                <Icon_Profile  Image_Src={Img}/>
                <div className='info-profile'>
                    <h1>{Name}</h1>
                    <h2>{Bio}</h2>
                    <h3>{Address}</h3>
                </div>
            </div>
            <Link to={'/edit-profile'} ><Button text={t('Edit')} /></Link>
        </div>
    );
}

export default Info_Item;