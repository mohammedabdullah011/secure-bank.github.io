import  './Icon.scss';

function Icon(props) {
    return(
        <div className='column-icon'>
            <div className='icon' style={{ backgroundImage: `url(${props.img})` }}></div>
            <h2 className='text-icon'>{props.name}</h2>
        </div>
    );
}

export default Icon;