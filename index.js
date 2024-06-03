import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import Home from './pages/Home';
import Services from './pages/Services';
import Privacy from './pages/Privacy';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Nav_Dashboard from './components/Nav_Dashboard';
import Privacy_Dashboard from './pages/Privacy-Dashboard';
import Navigation_bar from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Add_Card_Sign from './pages/Add_Card_Sign';
import Add_Card from './pages/Add_Card';
import Billing_Received from './pages/Billing_Received';
import Billing from './pages/Billing';
import Bills from './pages/Bills';
import Edit_Profile from './pages/Edit_Profile';
import Login from './pages/Login';
import Notification from './pages/Notification';
import Notifications from './pages/Notifications';
import Pay from './pages/Pay';
import Payment from './pages/Payment';
import PrivateRoutes from './PrivateRoute'; // Import the PrivateRoute component
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Sign_Up from './pages/Sign_up';
import Transaction from './pages/Transaction';
import Transactions from './pages/Transactions';
import Withdraw from './pages/Withdraw';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Forget_Login from './pages/Forget_Login';



function App() {
  return (
    <BrowserRouter>
      {/* Navigation bar for specific pages */}
      <Routes>
        {/* Home */}
        <Route path="/" element={<LayoutWithNav><Home /></LayoutWithNav>} />
        <Route path="services" element={<LayoutWithNav><Services /></LayoutWithNav>} />
        <Route path="about" element={<LayoutWithNav><About /></LayoutWithNav>} />
        <Route path="contact" element={<LayoutWithNav><Contact /></LayoutWithNav>} />
        <Route path="privacy" element={<LayoutWithNav><Privacy /></LayoutWithNav>} />


        {/* Other pages */}

          <Route element={<PrivateRoutes />}>
            <Route path="dashboard" element={<LayoutWithDashboard><Dashboard /></LayoutWithDashboard>} exact />
            <Route path="add-card" element={<LayoutWithDashboard><Add_Card /></LayoutWithDashboard>}/>
            <Route path="billing-received" element={<LayoutWithDashboard><Billing_Received /></LayoutWithDashboard>}/>
            <Route path="billing" element={<LayoutWithDashboard><Billing /></LayoutWithDashboard>}/>
            <Route path="bills" element={<LayoutWithDashboard><Bills /></LayoutWithDashboard>}/>
            <Route path="edit-profile" element={<LayoutWithDashboard><Edit_Profile /></LayoutWithDashboard>}/>
            <Route path="notification" element={<LayoutWithDashboard><Notification /></LayoutWithDashboard>}/>
            <Route path="notifications" element={<LayoutWithDashboard><Notifications /></LayoutWithDashboard>}/>
            <Route path="pay" element={<LayoutWithDashboard><Pay /></LayoutWithDashboard>}/>
            <Route path="payment" element={<LayoutWithDashboard><Payment /></LayoutWithDashboard>}/>
            <Route path="privacy-dashboard" element={<LayoutWithDashboard><Privacy_Dashboard /></LayoutWithDashboard>}/>
            <Route path="profile" element={<LayoutWithDashboard><Profile /></LayoutWithDashboard>}/>
            <Route path="settings" element={<LayoutWithDashboard><Settings /></LayoutWithDashboard>}/>
            <Route path="transaction" element={<LayoutWithDashboard><Transaction /></LayoutWithDashboard>}/>
            <Route path="transactions" element={<LayoutWithDashboard><Transactions /></LayoutWithDashboard>}/>
            <Route path="withdraw" element={<LayoutWithDashboard><Withdraw /></LayoutWithDashboard>}/>
            
          </Route>

          <Route path="add-card-sign" element={<Layout><Add_Card_Sign /></Layout>}/>
        <Route path="login" element={<Layout><Login /></Layout>} />
        <Route path="sign-up" element={<Layout><Sign_Up /></Layout>} />
        <Route path="forget-login" element={<Layout><Forget_Login /></Layout>} />
        <Route path="*" element={<NotFound />}/>
      </Routes>
    </BrowserRouter>
  );
}

// Layout component with Navigation bar
function LayoutWithNav({ children }) {
  return (
    <>
      <Navigation_bar />
      <Layout>{children}</Layout>
    </>
  );
}

// Layout component with Dashboard navigation
function LayoutWithDashboard({ children }) {
  return (
    <>
      <Nav_Dashboard />
      <Layout>{children}</Layout>
    </>
  );
}

// Common layout component
function Layout({ children }) {
  return <div>{children}</div>;
}

ReactDOM.render(

    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
,
  document.getElementById('root')
);

reportWebVitals();
