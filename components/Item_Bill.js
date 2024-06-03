import './Item_Bill.scss';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

function Item_Bill({ title, price, currency, onTitleChange, onPriceChange, onCurrencyChange }) {
    const handleTitleChange = (e) => {
        onTitleChange(e.target.value);
    };
    const { t, i18n } = useTranslation();

    const handlePriceChange = (e) => {
        // Prevent zero and negative values
        const newPrice = parseInt(e.target.value);
        if (newPrice > 0) {
            onPriceChange(newPrice);
        } else if (newPrice == 0){
            alert('Zero is not correct');
        } else if (newPrice < 0){
            alert('Minus is not correct');
        }
    };

    const handleCurrencyChange = (e) => {
        onCurrencyChange(e.target.value);
    };

    return (
        <div className='item-bill'>
            <div className='top-item-bill'>
                <h1>{t('Item')}</h1>
                <input
                    className='title-one'
                    type='text'
                    maxLength={30}
                    placeholder={t('Title')}
                    value={title}
                    onChange={handleTitleChange}
                />
            </div>
            <div className='row-item-bill'>
                <input
                    className='price'
                    type='number'
                    placeholder={t('Price')}
                    min="0"
                    value={price}
                    onChange={handlePriceChange}
                />
                <select value={currency} onChange={handleCurrencyChange}>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="EGP">EGP</option>
                </select>
            </div>
        </div>
    );
}

export default Item_Bill;
