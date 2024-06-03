import React, { useState, useEffect } from 'react';
import './Latest_Trans.scss';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Latest_Trans() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://localhost:8000/api/get_transactions', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setTransactions(data);
            } else {
                throw new Error('Failed to fetch latest transactions');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <div>Loading...</div>
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Filter transactions array to include only transactions of type "Withdraw"
    const withdrawTransactions = transactions.filter(transaction => transaction.type === 'Withdraw').slice(0, 6);

    return (
        <div className='latest-trans'>
            <h1>{t('LatestWithdrawTransactions')}</h1>
            <table>
                <thead>
                    <tr>
                        <th>{t('Date')}</th>
                        <th>{t('Amount')}</th>
                        <th>{t('Recipient')}</th>
                        <th>{t('Type')}</th>
                    </tr>
                </thead>
                <tbody>
                    {withdrawTransactions.map((transaction, index) => (
                        <tr key={index}>
                            <td><Link className='td' to={`/transaction?date=${transaction.date}&description=${transaction.description}&amount=${transaction.amount}&from=${transaction.from}&to=${transaction.to}&type=${transaction.type}&currency=${transaction.currency}`}>{transaction.date}</Link></td>
                            <td><Link className='td' to={`/transaction?date=${transaction.date}&description=${transaction.description}&amount=${transaction.amount}&from=${transaction.from}&to=${transaction.to}&type=${transaction.type}&currency=${transaction.currency}`}>{new Intl.NumberFormat('en-US', { style: 'currency', currency: transaction.currency }).format(transaction.amount)}</Link></td>
                            <td><Link className='td' to={`/transaction?date=${transaction.date}&description=${transaction.description}&amount=${transaction.amount}&from=${transaction.from}&to=${transaction.to}&type=${transaction.type}&currency=${transaction.currency}`}>{transaction.to}</Link></td>
                            <td><Link className='td' to={`/transaction?date=${transaction.date}&description=${transaction.description}&amount=${transaction.amount}&from=${transaction.from}&to=${transaction.to}&type=${transaction.type}&currency=${transaction.currency}`}>{transaction.type}</Link></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Latest_Trans;
