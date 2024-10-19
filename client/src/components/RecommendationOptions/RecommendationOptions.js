import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../Navbar/Navbar';
import './RecommendationOptions.css';
import LoginPopup from '../LoginPopup/LoginPopup';

function RecommendationOptions() {
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
    <div className='RecommendationOptions'>
      <Navbar />
      <div className="content">
        <h1>음악 추천 옵션</h1>
        <p className='description'>
          선호하는 아티스트 또는 장르를 선택하여 맞춤형 음악 추천을 받아보세요.<br />
          어떤 것을 선택하시겠습니까?
        </p>
      </div>
      <div className='select-content'>
        <div className='options'>
          <Link to="/artists" className='option-button'>
            <img src="/images/artist.png" alt="artist" />
            <span>아티스트</span>
          </Link>
          <Link to="/genres" className='option-button'>
            <img src="/images/genre.png" alt="genre" />
            <span>장르</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RecommendationOptions;
