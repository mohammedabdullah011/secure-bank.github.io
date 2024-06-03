import  './Icons.scss';
import Icon from './Icon.js';

import speed from '../assets/speed.jpg';
import security from '../assets/security.jpg';
import safety from '../assets/safety.jpg';
import easy from '../assets/easy.jpg';


function Icons() {
    return(
        <div className='row-icons' rel="preload" loading="eager">
            <Icon name='Speed' img={speed} />
            <Icon name='Easy' img={easy} />
            <Icon name='Safety' img={safety} />
            <Icon name='Security' img={security} />
        </div>
    );
}

export default Icons;