import React from 'react';
import './ProfilePopup.css';
import { useAuth } from '../../contexts/AuthContext';

const ProfilePopup = ({ isOpen, onClose, onLogout }) => {
  const { userProfile, logout } = useAuth();

  const handleLogout = () => {
    logout(); // AuthContext에서 제공하는 logout 호출
    onLogout(); // 추가적인 클로즈 핸들러 호출
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
        <a href="/likedSongs">좋아요 표시한 곡</a>
        <button className="logout-button" onClick={handleLogout}>로그아웃</button>
      </div>
    </div>
  );
};

export default ProfilePopup;
