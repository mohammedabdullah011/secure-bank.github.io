import './Item.scss';
import React, { useState } from 'react';

function Item({head1 = "The Item", price = 0}){
    return(
        <div className='item'>
            <h1>
            {head1}
            </h1>
            <h2>
            {price}
            </h2>
        </div>
    );
}

export default Item;