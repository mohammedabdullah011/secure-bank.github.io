
import Bottom from '../components/Bottom';
import Icons from '../components/Icons';
import Navigation_bar from '../components/Navigation';
import TopImage from '../components/TopImage';
import './Home.scss';
import Secure1 from '../assets/secure-one.jpg';
import Secure2 from '../assets/secure-two.jpg';

function Home() {
    return (
        <div className="home">
            
            <TopImage />
            <div className='body'>
                <h1 className='head-home'><snap>Secure Bank</snap> is for everyone who pays or gets paid.</h1>
                <Icons />
                <div className='container-home' loading="eager"></div>
                <div className='bottom-body'>
                    <div className='top-bottom-body'>
                        <div className='secure-one' rel="preload" loading="eager"></div>
                        <p className='p-bottom-body'> 
                        In today's fast-paced world, ensuring the safety and security of your home, 
                        business, or community is more important than ever. At Secure Bank, we understand 
                        the importance of feeling protected in your environment, which is why we offer 
                        a comprehensive range of security solutions designed to meet your unique needs and 
                        provide peace of mind.
                        </p>
                    </div>
                    <div className='secure-two' rel="preload" loading="eager"></div>
                </div>

            </div>
            <Bottom 
            p="Ready to enhance your security? Contact us today to schedule a consultation with one of our 
            security experts. We'll work with you to assess your security needs, recommend the right solutions, 
            and help you achieve peace of mind knowing that your property is protected."
            />
        </div>
    );

}

export default Home;