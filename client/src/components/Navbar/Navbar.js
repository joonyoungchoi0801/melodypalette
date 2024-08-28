import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginPopup from '../LoginPopup/LoginPopup';
import ProfilePopup from '../ProfilePopup/ProfilePopup';
import './Navbar.css';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const { isLoggedIn, login, logout } = useAuth();
  const navigate = useNavigate();

  const openLoginPopup = () => setIsLoginPopupOpen(true);
  const closeLoginPopup = () => setIsLoginPopupOpen(false);

  const openProfilePopup = () => setIsProfilePopupOpen(true);
  const closeProfilePopup = () => setIsProfilePopupOpen(false);

  const handleLoginSuccess = (username, email, token) => {
    login(token);
    navigate('/');
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      openProfilePopup();
    } else {
      openLoginPopup();
    }
  };

  const handleLogout = () => {
    logout();
    closeProfilePopup();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 50); // 스크롤 위치가 50px을 넘으면 색상을 변경
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : 'transparent'}`}>
      <div className="navbar-container">
        <h3 className="logo">Melodypalette</h3>
        <nav className="navbar-box">
          <ul>
            <li><a href="#section1">제목 또는 아티스트 검색</a></li>
            <li><a href="#section2">실시간 TOP 랭킹</a></li>
            <li><a href="#section3">Playlist</a></li>
            <li>
              <a href="#profile" onClick={handleProfileClick}>
                {isLoggedIn ? '프로필' : '로그인'}
              </a>
            </li>
          </ul>
        </nav>
      </div>
      
      <LoginPopup
        isOpen={isLoginPopupOpen}
        onClose={closeLoginPopup}
        onLoginSuccess={handleLoginSuccess}
      />

      <ProfilePopup
        isOpen={isProfilePopupOpen}
        onClose={closeProfilePopup}
        onLogout={handleLogout}
      />
    </header>
  );
}

export default Navbar;
