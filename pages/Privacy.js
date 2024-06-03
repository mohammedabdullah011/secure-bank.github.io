import Bottom from '../components/Bottom';
import Navigation_bar from '../components/Navigation';
import TextContainer from '../components/TextContainer';
import './Privacy.scss';

function Privacy() {
    return (
        <div className='Privacy'>

            <TextContainer
                p="At Secure Bank, we take the security and privacy of your personal and financial information 
            very seriously. We are committed to safeguarding your data and providing you with a secure and 
            trustworthy banking experience. Here's how we protect your information:"
            />
            <div className='privacy-body'>
                <div className='long-line'></div>
                <p className='p-privacy'>
                    All data transmitted between your browser and our servers is
                    encrypted using industry-standard encryption protocols, such as
                    Secure Socket Layer (SSL) or Transport Layer Security (TLS). This
                    ensures that your sensitive information, including login credentials,
                    account details, and transaction data, remains confidential and secure during transmission.
                </p>
                <div className='small-line'></div>
                <p className='p-privacy'>
                    We employ advanced fraud monitoring and detection systems that analyze transaction
                    patterns and behavior to identify and flag potentially fraudulent activity in real-time.
                    If suspicious activity is detected, our fraud prevention team will promptly investigate and
                    take appropriate action to protect your accounts and mitigate any potential risks.
                </p>

                <div className='small-line'></div>
                <p className='p-privacy'>
                    We are committed to protecting your privacy and adhering to strict data protection laws and
                    regulations. Our privacy policy outlines how we collect, use, and safeguard your personal
                    information, as well as your rights and options regarding the use of your data. We are transparent
                    about our data practices and strive to earn and maintain your trust.
                </p>

                <div className='small-line'></div>
                <p className='p-privacy'>
                    We comply with industry regulations and standards governing the banking and financial
                    services sector, including the Gramm-Leach-Bliley Act (GLBA), the Payment Card Industry
                    Data Security Standard (PCI DSS), and the General Data Protection Regulation (GDPR). Our
                    compliance efforts ensure that your data is handled securely and in accordance with applicable
                    laws and regulations.
                </p>
            </div>
            <Bottom 
            p='At Secure Bank, your security and privacy are our top priorities. We are committed 
            to continuously investing in and improving our security infrastructure to protect your 
            information and provide you with a safe and secure banking experience.'
            />
        </div>

    );
}


export default Privacy;