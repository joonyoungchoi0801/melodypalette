import React, { useEffect, useState } from 'react';
import './ProfilePopup.css';
// import { useNavigate } from 'react-router-dom';

const ProfilePopup = ({ isOpen, onClose, userProfile, onLogout }) => {
  const [displayProfile, setDisplayProfile] = useState(userProfile);
  // const navigate = useNavigate();

  useEffect(() => {
    setDisplayProfile(userProfile);
  }, [userProfile]);

  const handleLogout = () => {
    // 스포티파이 로그아웃 처리
    window.location.href = 'http://localhost:5000/api/spotify/logout';
  };

  if (!isOpen) return null;

  return (
    <div className="profile-popup-overlay">
      <div className="profile-popup">
        <button className="close-button" onClick={onClose}>X</button>
        <h2 className='profile'>프로필</h2>
        <div className="profile-info">
          <img 
            src={displayProfile?.imageUrl || '/images/profile.png'} 
            alt="Profile" 
            className="profile-image" 
          />
          <div className="profile-details">
            <p className="profile-username">{displayProfile?.name || '정보 없음'}</p>
          </div>
        </div>
        <button className="logout-button" onClick={handleLogout}>로그아웃</button>
      </div>
    </div>
  );
};

export default ProfilePopup;
