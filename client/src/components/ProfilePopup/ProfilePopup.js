import React from 'react';
import './ProfilePopup.css'; // 스타일 파일 추가

const ProfilePopup = ({ isOpen, onClose, username, userEmail }) => {
  if (!isOpen) return null;

  return (
    <div className="profile-popup-overlay">
      <div className="profile-popup">
      <button className="close-button" onClick={onClose}>X</button>
        <h2 className='profile'>프로필</h2>
        <img 
            src="/images/profile.png" 
            alt="Profile" 
            className="profile-image" 
          />
        <p>사용자 이름: {username}</p>
        <p>이메일: {userEmail}</p>
      </div>
    </div>
  );
};

export default ProfilePopup;
