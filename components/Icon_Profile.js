import React, { useState, useEffect } from 'react';
import './Icon_Profile.scss';
import defaultProfileImg from '../assets/profile.png';

function Icon_Profile() {
    const [imageSrc, setImageSrc] = useState(defaultProfileImg);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                const response = await fetch('https://localhost:8000/api/get_user_data', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    // Assuming the response contains the image URL in the 'image_url' field
                    setImageSrc(data[0].image_url); // Assuming data is an array and you want the first user's image
                } else {
                    throw new Error('Failed to fetch profile image');
                }
            } catch (error) {
                console.error('Error fetching profile image:', error);
            }finally {
                setLoading(false);
            }
        };

        fetchProfileImage();
    }, []); // Empty dependency array to fetch data only once when the component mounts


    
    if (loading) {
        return <div className="loading">
        <div className="spinner"></div>
        
    </div>
    
    }

    if (error) {
        return <div>Error: {error}</div>;
    }


    return (
        <div className='icon-profile' style={{backgroundImage: `url('${imageSrc}')`}}>

            {/* You can add additional content or styling here */}
        </div>
    );
}

export default Icon_Profile;
