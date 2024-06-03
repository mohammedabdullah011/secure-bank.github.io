import React, { useState } from 'react';
import './ChangeProfile.scss';
import profile from '../assets/profile.png';
import { useNavigate } from 'react-router-dom';

function ChangeProfile() {
  const [selectedImage, setSelectedImage] = useState(profile);
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        
        // Create FormData object to send the image file
        const formData = new FormData();
        formData.append('image_file', file);

        const token = localStorage.getItem('token');
        // Send POST request to upload the image
        fetch('https://localhost:8000/api/get_image/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          // Redirect to edit-profile page with selectedImage state
          navigate('/edit-profile', { state: { selectedImage: data.image_path } });
        })
        .catch(error => console.error('Error uploading image:', error));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='change-profile' style={{backgroundImage: `url(${selectedImage})`}}>
      <label className='profile-image-label' htmlFor='profile-image-input'>
        <input type='file' accept='image/*' id='profile-image-input' name='image' onChange={handleImageChange} />
      </label>
    </div>
  );
}

export default ChangeProfile;
