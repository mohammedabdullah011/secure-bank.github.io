import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import './Transactions.scss';
import { useTranslation } from 'react-i18next';

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateFilter, setDateFilter] = useState('');
    const [fromFilter, setFromFilter] = useState('');
    const [toFilter, setToFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const { t, i18n } = useTranslation();

    useEffect(() => {
        // Fetch transaction data from the backend API
        fetchTransactions();
    }, []); // Empty dependency array ensures this effect runs only once on component mount

    useEffect(() => {
        filterTransactions();
    }, [transactions, dateFilter, fromFilter, toFilter, typeFilter]);

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem('token');
            // Make an HTTP GET request to the backend API
            const response = await fetch('https://localhost:8000/api/get_transactions', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Parse the response body as JSON
                const data = await response.json();
                // Update state with the retrieved transactions
                setTransactions(data);
            } else {
                console.error('Failed to fetch transactions:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const filterTransactions = () => {
        let filtered = transactions.filter(transaction => {
            let match = true;
            if (dateFilter && transaction.date !== dateFilter) {
                match = false;
            }
            if (fromFilter && !transaction.from.toLowerCase().includes(fromFilter.toLowerCase())) {
                match = false;
            }
            if (toFilter && !transaction.to.toLowerCase().includes(toFilter.toLowerCase())) {
                match = false;
            }
            if (typeFilter && transaction.type !== typeFilter) {
                match = false;
            }
            return match;
        });
        
        // Sort the filtered transactions by date in descending order
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Reverse the array to put newer transactions at the bottom
        filtered.reverse();
        
        setFilteredTransactions(filtered);
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

    return (
        <div className='transactions'>
            <div className='content-transactions'>
                <div className='top-transactions'>
                    <h1>{t('Transactions')}</h1>
                    <div className='row-transactions'>
                        <Link to='/pay'><Button text={t('Pay')} /></Link>
                        <Link to='/withdraw'><Button text={t('Withdraw')} /></Link>
                    </div>
                </div>
                <div className='status'>
                    <input
                        type="date"
                        className='date-transactions'
                        placeholder={t("Date")}
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    />
                    <input
                        type='text'
                        className='from-transactions'
                        placeholder={t('From')}
                        value={fromFilter}
                        onChange={(e) => setFromFilter(e.target.value)}
                    />
                    <input
                        type='text'
                        className='to-transactions'
                        placeholder={t('To')}
                        value={toFilter}
                        onChange={(e) => setToFilter(e.target.value)}
                    />
                    <select
                        className='type-transactions'
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="" disabled>{t('Type')}</option>
                        <option value="Withdraw">{t('Withdraw')}</option>
                        <option value="Pay">{t('Pay')}</option>
                    </select>
                </div>
                <div className='table-transactions'>
                    <table>
                        <thead>
                            <tr>
                                <th>{t('Date')}</th>
                                <th>{t('Description')}</th>
                                <th>{t('Amount')}</th>
                                <th>{t('From')}</th>
                                <th>{t('To')}</th>
                                <th>{t('Type')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((transaction, index) => (
                                <tr key={index}>
                                    <td><Link to={`/transaction?date=${transaction.date}&description=${transaction.description}&amount=${transaction.amount}&from=${transaction.from}&to=${transaction.to}&type=${transaction.type}&currency=${transaction.currency}`}>{transaction.date}</Link></td>
                                    <td><Link to={`/transaction?date=${transaction.date}&description=${transaction.description}&amount=${transaction.amount}&from=${transaction.from}&to=${transaction.to}&type=${transaction.type}&currency=${transaction.currency}`}>{transaction.description}</Link></td>
                                    <td><Link to={`/transaction?date=${transaction.date}&description=${transaction.description}&amount=${transaction.amount}&from=${transaction.from}&to=${transaction.to}&type=${transaction.type}&currency=${transaction.currency}`}>{new Intl.NumberFormat('en-US', { style: 'currency', currency: transaction.currency }).format(transaction.amount)}</Link></td>
                                    <td><Link to={`/transaction?date=${transaction.date}&description=${transaction.description}&amount=${transaction.amount}&from=${transaction.from}&to=${transaction.to}&type=${transaction.type}&currency=${transaction.currency}`}>{transaction.from}</Link></td>
                                    <td><Link to={`/transaction?date=${transaction.date}&description=${transaction.description}&amount=${transaction.amount}&from=${transaction.from}&to=${transaction.to}&type=${transaction.type}&currency=${transaction.currency}`}>{transaction.to}</Link></td>
                                    <td><Link to={`/transaction?date=${transaction.date}&description=${transaction.description}&amount=${transaction.amount}&from=${transaction.from}&to=${transaction.to}&type=${transaction.type}&currency=${transaction.currency}`}>{transaction.type}</Link></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Transactions;
