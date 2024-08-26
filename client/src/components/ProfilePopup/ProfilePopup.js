import React, { useEffect, useState } from 'react';
import './ProfilePopup.css';

const ProfilePopup = ({ isOpen, onClose, onLogout }) => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');

    if (accessToken) {
      fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then(response => response.json())
        .then(data => setUserProfile(data))
        .catch(error => console.error('Error fetching user profile:', error));
    }
  }, []);

  const handleLogout = () => {
    onLogout();
  };

  if (!isOpen) return null;

  return (
    <div className="profile-popup-overlay">
      <div className="profile-popup">
        <button className="close-button" onClick={onClose}>X</button>
        <h2 className='profile'>프로필</h2>
        <div className="profile-info">
          <img 
            src={userProfile?.images?.[0]?.url || '/images/profile.png'} 
            alt="Profile" 
            className="profile-image" 
          />
          <div className="profile-details">
            <p className="profile-username">{userProfile?.display_name || '정보 없음'}</p>
          </div>
        </div>
        <button className="logout-button" onClick={handleLogout}>로그아웃</button>
      </div>
    </div>
  );
};

export default ProfilePopup;
