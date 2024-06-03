
import './Bottom.scss';
import { Link } from 'react-router-dom';

function Bottom(props) {
    return(
        <div className='bottom'>
            <p className='p-bottom'>
                {props.p}
            </p>

            <Link to="/sign-up"><button className='button-bottom'>Get Started</button></Link>
        </div>
    );
}

export default Bottom;