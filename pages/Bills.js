import React, { useState, useEffect } from 'react';
import './Bills.scss';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';


const SuccessAlert = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #d4edda; /* Light green background */
    color: #155724; /* Dark green text */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 30%;
    align-items: center;
    p {
        width: 100%; // Ensure the paragraph takes full width of the container
        word-wrap: break-word; // Allow long words to wrap to the next line
    }
`;

const ErrorAlert = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #d4edda; /* Light green background */
    color: #155724; /* Dark green text */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 30%;
    align-items: center;
    p {
        width: 100%; // Ensure the paragraph takes full width of the container
        word-wrap: break-word; // Allow long words to wrap to the next line
    }
    `
    ;


const OkButton = styled.button`
    background-color: #155724; /* Dark green background */
    color: #fff; /* White text */
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
`;

const USD_TO_EUR_RATE = 0.92;
const USD_TO_EGP_RATE = 46.90;

function Bills() {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterDate, setFilterDate] = useState('');
    const [filterFrom, setFilterFrom] = useState('');
    const [filterTo, setFilterTo] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { t, i18n } = useTranslation();


    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://localhost:8000/api/get_bills', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setBills(data);
            } else {
                setErrorMessage('Failed to fetch bills');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOkClick = () => {
        setErrorMessage('');
        setSuccessMessage('');
    };


    const sortedBills = [...bills].sort((a, b) => new Date(a.date) - new Date(b.date));

    const filteredBills = sortedBills.filter(bill => {
        const dateMatch = filterDate ? bill.date.includes(filterDate) : true;
        const fromMatch = filterFrom ? bill.from.toLowerCase().includes(filterFrom.toLowerCase()) : true;
        const toMatch = filterTo ? bill.to.toLowerCase().includes(filterTo.toLowerCase()) : true;
        return dateMatch && fromMatch && toMatch;
    });
    

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
        <div className='bills'>
            {successMessage && (
                <SuccessAlert>
                    <p>{successMessage}</p>
                    <OkButton onClick={handleOkClick}>OK</OkButton>
                </SuccessAlert>
            )}
            {errorMessage && (
                <ErrorAlert>
                    <p>{errorMessage}</p>
                    <OkButton onClick={handleOkClick}>OK</OkButton>
                </ErrorAlert>
            )}
            <div className='content-bills'>
                <div className='top-bills'>
                    <h1>{t('Bills')}</h1>
                    <Link to='/billing'><Button text={t('CreateBill')} /></Link>
                </div>
                <div className='status'>
                    <input
                        type="date"
                        className='date-bills'
                        placeholder={t("Date")}
                        value={filterDate}
                        onChange={e => setFilterDate(e.target.value)}
                    />
                    <input
                        type='text'
                        className='from-bills'
                        placeholder={t('From')}
                        value={filterFrom}
                        onChange={e => setFilterFrom(e.target.value)}
                    />
                    <input
                        type='text'
                        className='to-bills'
                        placeholder={t('To')}
                        value={filterTo}
                        onChange={e => setFilterTo(e.target.value)}
                    />
                </div>
                <div className='table-bill'>
                    <table>
                        <thead>
                            <tr>
                                <th>{t('Date')}</th>
                                <th>{t('Title')}</th>
                                <th>{t('Total')}</th>
                                <th>{t('From')}</th>
                                <th>{t('To')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBills.map((bill, index) => (
                                <tr key={index}>
                                    <td><Link className='td' to={`/billing-received?date=${bill.date}&description=${bill.description}&items=${JSON.stringify(bill.items)}&from=${bill.from}&to=${bill.to}&Status=${bill.status}&title=${bill.title}&total=${calculateTotal(bill.items)}`}>{bill.date}</Link></td>
                                    <td><Link className='td' to={`/billing-received?date=${bill.date}&description=${bill.description}&items=${JSON.stringify(bill.items)}&from=${bill.from}&to=${bill.to}&Status=${bill.status}&title=${bill.title}&total=${calculateTotal(bill.items)}`}>{bill.title}</Link></td>
                                    <td><Link className='td' to={`/billing-received?date=${bill.date}&description=${bill.description}&items=${JSON.stringify(bill.items)}&from=${bill.from}&to=${bill.to}&Status=${bill.status}&title=${bill.title}&total=${calculateTotal(bill.items)}`}>${calculateTotal(bill.items)}</Link></td>
                                    <td><Link className='td' to={`/billing-received?date=${bill.date}&description=${bill.description}&items=${JSON.stringify(bill.items)}&from=${bill.from}&to=${bill.to}&Status=${bill.status}&title=${bill.title}&total=${calculateTotal(bill.items)}`}>{bill.from}</Link></td>
                                    <td><Link className='td' to={`/billing-received?date=${bill.date}&description=${bill.description}&items=${JSON.stringify(bill.items)}&from=${bill.from}&to=${bill.to}&Status=${bill.status}&title=${bill.title}&total=${calculateTotal(bill.items)}`}>{bill.to}</Link></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const calculateTotal = (items) => {
    let total = 0;
    items.forEach((item) => {
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
    return parseFloat(total.toString()).toFixed(2);
};

export default Bills;
