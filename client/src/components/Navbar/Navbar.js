import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginPopup from '../LoginPopup/LoginPopup';
import ProfilePopup from '../ProfilePopup/ProfilePopup';
import './Navbar.css';

const fetchUserData = async (token) => {
  try {
    const response = await fetch('http://localhost:5000/api/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

function Navbar() {
  const [backgroundColor, setBackgroundColor] = useState('transparent');
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [username, setUsername] = useState('');
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const { isLoggedIn, login, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        const userData = await fetchUserData(token);

        if (userData) {
          setUserEmail(userData.email);
          setUsername(userData.username);
        } else {
          logout(); // 인증 실패 시 로그아웃 처리
        }
      }
    };

    checkLoginStatus();
  }, [login, logout]);

  const openLoginPopup = () => setIsLoginPopupOpen(true);
  const closeLoginPopup = () => setIsLoginPopupOpen(false);

  const openProfilePopup = () => setIsProfilePopupOpen(true);
  const closeProfilePopup = () => setIsProfilePopupOpen(false);

  const switchToSignup = () => {
    closeLoginPopup();
  };

  const handleLoginSuccess = (username, email, token) => {
    login(token);
    setUserEmail(email);
    setUsername(username);
  };

  useEffect(() => {
    if (userEmail && username) {
      navigate('/');
    }
  }, [userEmail, username, navigate]);

  const handleProfileClick = () => {
    if (isLoggedIn) {
      openProfilePopup();
    } else {
      openLoginPopup();
    }
  };

  const handleLogout = () => {
    logout();
    setUserEmail('');
    setUsername('');
    closeProfilePopup();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setBackgroundColor(offset > window.innerHeight ? 'black' : 'transparent');
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="navbar" style={{ backgroundColor }}>
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
        switchToSignup={switchToSignup}
        onLoginSuccess={handleLoginSuccess}
      />

      <ProfilePopup
        isOpen={isProfilePopupOpen}
        onClose={closeProfilePopup}
        userEmail={userEmail}
        username={username}
        onLogout={handleLogout}
      />
    </header>
  );
}

export default Navbar;
