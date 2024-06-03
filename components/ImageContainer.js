import './ImageContainer.scss';

function ImageContainer(props) {
    const imageContainer = props.position === 'right' ? 'imageContainer--right' : 'imageContainer--left';
    return (
        <div className={imageContainer}>
            <div rel="preload" loading="eager" style={{ backgroundImage: `url(${props.image})`}} className='image-imageContainer'></div>
            <p className='p-imageContainer'>
                {props.p}
            </p>
        </div>
    );
}

export default ImageContainer;