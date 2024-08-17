import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../Navbar/Navbar';
import './Recommendation.css';
import LoginPopup from '../LoginPopup/LoginPopup';

function Recommendation() {
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const { isLoggedIn, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoginPopupOpen(true); // 로그인이 되어 있지 않으면 팝업을 엽니다.
    }
  }, [isLoggedIn]);

  const handleLoginSuccess = (email, username, token) => {
    login(token); // 로그인 상태를 업데이트
    setIsLoginPopupOpen(false); // 팝업 닫기
    navigate('/'); // 메인 페이지로 이동
  };

  const handlePopupClose = () => {
    if (!isLoggedIn) {
      setIsLoginPopupOpen(false); // 팝업 닫기
      navigate('/'); // 메인 페이지로 이동
    }
  };

  if (!isLoggedIn && isLoginPopupOpen) {
    return (
      <LoginPopup
        isOpen={isLoginPopupOpen}
        onClose={handlePopupClose}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div className='Recommendation'>
      <Navbar />
      <div className="content">
        <h1>음악 추천</h1>
        <p className='description'>
          선호하는 아티스트 또는 장르를 선택하여 맞춤형 음악 추천을 받아보세요.<br />
          어떤 것을 선택하시겠습니까?
        </p>
      </div>
      <div className='select-content'>
        <div className='options'>
          <Link to="/artists" className='option-button'>아티스트로 선택</Link>
          <Link to="/genres" className='option-button'>장르로 선택</Link>
        </div>
      </div>
    </div>
  );
}

export default Recommendation;
