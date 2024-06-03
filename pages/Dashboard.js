import './Dashboard.scss';
import { React, useState, useEffect } from 'react';
import Nav_Dashboard from '../components/Nav_Dashboard';
import Icon_Profile from '../components/Icon_Profile';
import Button from '../components/Button';
import Recent_Trans from '../components/Recent_Trans';
import Circle_Statistic from '../components/Circle_Statistic';
import Card_Dashboard from '../components/Card_Dashboard';
import { Link, useNavigate} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Dashboard() {
    const [userData, setUserData] = useState(null); // State to store user data
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const [profitData, setProfitData] = useState({
        withdraw_all: 0,
        pay_all: 0,
        balance: 0,
        profit: 0
    });
    const [monthProfitData, setMonthProfitData] = useState({
        withdraw_all: 0,
        pay_all: 0,
        balance: 0,
        profit: 0,
        month: 0,
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('https://localhost:8000/api/get_user_data/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('User Data:', data); // Log userData to inspect its structure
                    setUserData(data);
                } else {
                    throw new Error('Failed to fetch user data');
                }
            } catch (error) {
                    setError(error.message);
                
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('https://localhost:8000/api/get_transactions', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
    
                if (response.ok) {
                    const data = await response.json();
                    // Sort transactions based on date in descending order
                    const sortedTransactions = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                    // Mix "Pay" and "Withdraw" types
                    sortedTransactions.sort((a, b) => {
                        if (a.type === 'Withdraw' && b.type === 'Pay') {
                            return -1; // Withdraw comes before Pay
                        } else if (a.type === 'Pay' && b.type === 'Withdraw') {
                            return 1; // Pay comes after Withdraw
                        } else {
                            return 0; // Same type or different types
                        }
                    });
                    setTransactions(sortedTransactions);
                } else {
                    throw new Error('Failed to fetch transactions');
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchTransactions();
    }, []);
    

    useEffect(() => {
        const fetchProfitData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('https://localhost:8000/api/get_profit', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setProfitData(data);
                } else {
                    throw new Error('Failed to fetch profit data');
                }
            } catch (error) {
                console.error('Error fetching profit data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfitData();
    }, []);


    useEffect(() => {
        const fetchProfitData = async () => {
            try {
                const token = localStorage.getItem('token');
                const now = new Date();
                const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Get current month and format (e.g., 01 for January)
                const response = await fetch(`https://localhost:8000/api/get_profit_for_month/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({month})
                });
        
                if (!response.ok) {
                    throw new Error(`Failed to fetch profit data: ${response.status} ${response.statusText}`);
                }
        
                const data = await response.json();
                setMonthProfitData(data);
                setLoading(false); // Set loading to false after successful data fetch
            } catch (error) {
                console.error('Error fetching profit data:', error);
                setError(error.message);
                setLoading(false); // Set loading to false in case of error
            }
        };
        
        
    
        fetchProfitData();
    }, []);
    
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


    

    const all_account = profitData.balance + profitData.withdraw_all




    return (
        <div className='dashboard'>
            
            <div className='content-dashboard'>
            {userData && (
                <div className='right-dashboard'>
                    <div className='top-dashboard'>
                        <Icon_Profile />
                        <h3>{t('AccountBalance')}</h3>
                        <h1>${profitData.balance}</h1>
                        <Link to="/withdraw"><Button text={t('Withdraw')} /></Link>
                    </div>
                    <div className='down-dashboard'>
                        <div className='right-dashboard'>
                            <h1>{t('Profile')}</h1>
                            <h3>{t('PersonalAccount')}</h3>
                            <Link to="/edit-profile"><Button text={t('Edit')} /></Link>
                        </div>
                        <div className='left-dashboard'>
                            {/* Check if userData array has elements */}
                            {userData.length > 0 && (
                                <>
                                    <h1>{`${userData[0].first_name} ${userData[0].last_name}`}</h1>
                                    <h2>{userData[0].email}</h2>
                                    <h3>{userData[0].phone}</h3>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
                <div className='left-dashboard'>

                <div className='top-left-dashboard'>
                    <h1>{t('RecentTransactions')}</h1>
                    {transactions.slice(0, 7).map((transaction, index) => (
                        <Recent_Trans key={index} transaction={transaction} />
                    ))}
                </div>
                    <div className='down-left-dashboard'>
                        <div className='right-down-left-dashbaord'>
                            <Card_Dashboard NameCard={t('Withdraw')} Price={monthProfitData.withdraw_all} Month={monthProfitData.month} value={monthProfitData.withdraw_all} maxValue={monthProfitData.profit} />
                            <Card_Dashboard NameCard={t('Pay')} Price={monthProfitData.pay_all} Month={monthProfitData.month} value={monthProfitData.pay_all} maxValue={monthProfitData.balance} />
                        </div>
                        <div className='left-down-left-dashboard'>
                            <div className='top'>
                                <h1>{t('AccountSummary')}</h1>
                                <h2>{t('All')}</h2>
                            </div>
                            <div className='mid'>
                                <div className='first'>
                                    <h1>{t('Withdraw')}</h1>
                                    <h2>{profitData.withdraw_all}</h2>
                                </div>
                                <div className='first'>
                                    <h1>{t('Balance')}</h1>
                                    <h2>{profitData.balance}</h2>
                                </div>
                                <div className='second'>
                                    <h1>{t('Pay')}</h1>
                                    <h2>${profitData.pay_all}</h2>
                                </div>
                                <div className='third'>
                                    <h1>{t('Profit')}</h1>
                                    <h2>${profitData.profit}</h2>
                                </div>
                            </div>
                            <Circle_Statistic value={profitData.profit} maxValue={profitData.balance} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;