import './Card.scss';
import React from 'react';
import Visa from '../assets/Visa.svg';
import Mastercard from '../assets/Mastercard.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function Card({ Image = Visa, Title = 'Visa', onSelect }) {
    const navigate = useNavigate();
    const handleSelect = () => {
        // Call the onSelect function with the selected card type
        onSelect(Title);
    };

    return (
        <div className='card-content'>
            <h1>{Title}</h1>
            <div style={{ backgroundImage: `url(${Image})` }} className="img"></div>
            <input
                type="radio"
                id="visa"
                className="form-check-input radio-input"
                name="flexRadioDefault"
                onChange={handleSelect}
            />
        </div>
    );
}

export default Card;
