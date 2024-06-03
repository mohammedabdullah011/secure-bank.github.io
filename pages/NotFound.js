import { Link } from 'react-router-dom';
import './NotFound.scss';

function NotFound(){
    return(
        <div className='notFound'>
            <h1 className='numberFound'>404</h1>
            <h2 className='textFound'>Whoops.... Page Not Found.</h2>
            <Link to={'/'}><button className='button-found'>Go Home</button></Link>
        </div>
    )
}

export default NotFound;