
import Navigation_bar from '../components/Navigation';
import './About.scss';
import { Link } from 'react-router-dom';

function About() {
    return (
        <div className='mmmmmmmmm'>
         
        
        <div className='about'>

            <p className='pr-about'>
            Secure Bank was founded in 2024 with the vision of providing accessible and reliable banking services 
            to individuals, businesses, and communities. Over the years, we have grown and evolved, adapting to changes 
            in the financial industry and expanding our range of products and services to meet the diverse needs 
            of our customers.
            <br/>
            <br/>
            <br/>
            <br/>
            At Secure Bank, our mission is to empower individuals and businesses to achieve their financial goals 
            and aspirations. We are committed to providing innovative banking solutions, personalized customer 
            service, and a seamless banking experience that helps our customers thrive in a dynamic and ever-changing world.
            <br/>
            <br/>
            <br/>
            <br/>
            Integrity: 
            <br/>
            <br/>
            We conduct business with honesty, transparency, and accountability, always acting in the best interests of our customers and stakeholders.
            <br/>
            <br/>
            Excellence: 
            <br/>
            <br/>
            We strive for excellence in everything we do, continuously seeking to improve and innovate to better serve our customers and communities.
            <br/>
            <br/>
            Customer Focus: 
            <br/>
            <br/>
            We prioritize the needs and preferences of our customers, delivering tailored solutions and personalized service to help them succeed financially.
            <br/>
            <br/>
            Community Engagement: 
            <br/>
            <br/>
            We are dedicated to making a positive impact in the communities we serve, supporting local initiatives, and giving back through philanthropic efforts and volunteerism.
            <br/>
            <br/>
            <br/>
            <br/>
            At ٍSecure Bank, we are committed to building long-lasting relationships with our customers based on trust, 
            reliability, and mutual respect. We are here to support you every step of the way on your financial journey, 
            providing guidance, expertise, and solutions that help you achieve your goals and dreams.
            <br/>
            <br/>
            <br/>
            <br/>
            We invite you to experience the difference in banking with Secure Bank. 
            Thank you for choosing Secure Bank as your trusted banking partner. We look forward to serving you 
            and helping you achieve your financial goals.
            </p>
            <Link to="/sign-up"><button className='button-about'>Get Started</button></Link>
            
        </div>
        </div>

    );
}


export default About;