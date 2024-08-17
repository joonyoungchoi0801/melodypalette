import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginPopup from '../LoginPopup/LoginPopup';
import SignupPopup from '../SignupPopup/SignupPopup';
import ProfilePopup from '../ProfilePopup/ProfilePopup';
import './Navbar.css';

const fetchUserData = async (token) => {
  try {
    const response = await fetch('https://localhost:5000/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

function Navbar({ onProfileClick }) {
  const [backgroundColor, setBackgroundColor] = useState('transparent');
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
  const [userEmail, setUserEmail] = useState(''); // 로그인된 사용자 이메일
  const [username, setUsername] = useState('');
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');
  
      if (token) {
        const userData = await fetchUserData(token);
  
        if (userData) {
          setIsLoggedIn(true);
          setUserEmail(userData.email);  // API에서 받은 이메일 설정
          setUsername(userData.username); // API에서 받은 사용자 이름 설정
        } else {
          setIsLoggedIn(false);  // 만약 데이터를 가져오지 못하면 로그아웃 상태로 처리
          localStorage.removeItem('token');  // 토큰 삭제
        }
      }
    };
  
    checkLoginStatus();
  }, []);


  const openLoginPopup = () => setIsLoginPopupOpen(true);
  const closeLoginPopup = () => setIsLoginPopupOpen(false);


  const openSignupPopup = () => setIsSignupOpen(true);
  const closeSignupPopup = () => setIsSignupOpen(false);

  const openProfilePopup = () => setIsProfilePopupOpen(true);
  const closeProfilePopup = () => setIsProfilePopupOpen(false);

  // useEffect(() => {
  //   console.log('User email:', userEmail);
  //   console.log('Username:', username);
  // }, [userEmail, username]);
  

  const switchToSignup = () => {
    closeLoginPopup();
    openSignupPopup();
  };

  const handleLoginSuccess = (email, username) => {
    setIsLoggedIn(true);
    setUserEmail(email); // 로그인된 사용자 이메일 저장
    setUsername(username); // 로그인된 사용자 username 저장
    console.log('로그인 성공:', { email, username });
    navigate('/');
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      openProfilePopup(); // 프로필 팝업 열기
    } else {
      openLoginPopup(); // 로그인되지 않은 사용자는 로그인 팝업 열기
    }
  };
//로그아웃
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    setUsername('');
    localStorage.removeItem('token'); // 토큰 삭제 또는 필요에 따라 다른 저장소 사용
    closeProfilePopup(); // 프로필 팝업 닫기
    navigate('/'); // 로그아웃 후 메인 페이지로 이동
  };

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > window.innerHeight) {
        setBackgroundColor('black');
      } else {
        setBackgroundColor('transparent');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="navbar" style={{ backgroundColor }}>
      <div className="navbar-container">
        <h3 className="logo">Melodypalette</h3>
        <nav className="navbar-box" >
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

      <SignupPopup
        isOpen={isSignupOpen}
        onClose={closeSignupPopup}
        openLoginPopup={() => setIsLoginPopupOpen(true)}
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
