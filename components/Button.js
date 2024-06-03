import './Button.scss';
import React, { useState } from 'react';

function Button({text, onclick}){

    return(
        <button className='button-all' onClick={onclick}>{text}</button>
    );
}

export default Button;