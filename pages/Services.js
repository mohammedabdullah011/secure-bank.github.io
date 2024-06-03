import './Services.scss';
import Finance from '../assets/finance.jpg';
import Regulation from '../assets/regulation.jpg';
import SSL from '../assets/ssl.jpg';
import Transactions from '../assets/transactions.jpg';
import BottomImage from '../assets/bottom.jpg';
import Navigation_bar from '../components/Navigation';
import TextContainer from '../components/TextContainer';
import ImageContainer from '../components/ImageContainer';
import Bottom from '../components/Bottom';

function Services() {
    return (
        <div className="sevices">

            <TextContainer
                p='Welcome to Secure Bank, where we prioritize the security and 
                    privacy of your financial transactions above all else. We offer a comprehensive 
                    range of banking services designed to protect your assets and provide you with peace of mind.'
            />
            <div className='service-body'>
                <div className='long-line'></div>
                <ImageContainer position='right' image={Finance}
                    p='Manage your finances securely and conveniently with our online banking platform. 
                        With robust encryption protocols and multi-factor authentication, you can access your 
                        accounts, check balances, transfer funds, pay bills, and view transaction history with 
                        confidence from anywhere, anytime.' />
                <div className='small-line'></div>

                <ImageContainer position='left' image={BottomImage}
                    p='Protect your accounts from unauthorized access and fraudulent activity with our 
                        advanced fraud protection measures. We employ state-of-the-art fraud detection algorithms,
                        real-time transaction monitoring, and alert notifications to safeguard your accounts against 
                        identity theft, phishing scams, and unauthorized transactions.' />
                <div className='small-line'></div>

                <ImageContainer position='right' image={SSL}
                    p='Rest assured knowing that your accounts are protected by industry-leading security measures. 
                        Our bank employs robust encryption protocols, secure socket layer (SSL) technology, and firewalls 
                        to encrypt and protect your sensitive information during transmission and storage, ensuring 
                        the confidentiality and integrity of your data.' />
                <div className='small-line'></div>

                <ImageContainer position='left' image={Transactions}
                    p="Make transactions with confidence knowing that your financial information is safe and secure. 
                        Whether you're transferring funds, paying bills, or making purchases online, our secure transaction
                        processing systems and fraud prevention tools ensure that your transactions are protected against 
                        unauthorized access and fraudulent activity." />
                <div className='small-line'></div>

                <ImageContainer position='right' image={Regulation}
                    p='Rest assured knowing that our bank is fully compliant with industry 
                        regulations and standards governing financial institutions. We adhere to 
                        strict regulatory requirements, such as the Payment Card Industry Data Security
                        Standard (PCI DSS) and the Bank Secrecy Act (BSA), to ensure the security, integrity, 
                        and confidentiality of your financial information.' />

            </div>

            <Bottom
                p="Ready to experience secure banking with Secure Bank? Open an account today and enjoy the 
            peace of mind that comes with knowing your finances are in safe hands. Whether you're banking online or on your mobile 
            device, we're committed to providing you with the highest level of security and service."
            />

        </div>
    );
}

export default Services;