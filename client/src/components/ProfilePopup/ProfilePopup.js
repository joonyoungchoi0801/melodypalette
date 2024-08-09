import React from 'react';
import './ProfilePopup.css'; // 스타일 파일 추가
import { useNavigate } from 'react-router-dom';

const ProfilePopup = ({ isOpen, onClose, username, userEmail, onLogout}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 로그아웃 처리
    localStorage.removeItem('token'); // 예시로 토큰을 삭제
    onLogout(); // 부모 컴포넌트에 로그아웃 처리 알림
    navigate('/'); // 로그아웃 후 로그인 페이지로 이동
  };

  if (!isOpen) return null;

  return (
    <div className="profile-popup-overlay">
      <div className="profile-popup">
      <button className="close-button" onClick={onClose}>X</button>
        <h2 className='profile'>프로필</h2>
        <div className="profile-info">
          <img 
                src="/images/profile.png" 
                alt="Profile" 
                className="profile-image" 
              />
          <div className="profile-details">
            <p className="profile-username">{username}</p>
            <p className="profile-email">{userEmail}</p>
          </div>
        </div>
      <button className="logout-button" onClick={handleLogout}>로그아웃</button>
      </div>
    </div>
  );
};

export default ProfilePopup;
