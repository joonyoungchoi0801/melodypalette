import React, { useState, useEffect } from 'react';
import './Navbar.css';

function Navbar({ onProfileClick }) {
  const [backgroundColor, setBackgroundColor] = useState('transparent');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  useEffect(() => {
    // Example check for login status; Replace with actual logic
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleProfileClick = () => {
    onProfileClick(isLoggedIn);
  };

  return (
    <nav className="navbar" style={{ backgroundColor }}>
      <div className="navbar-container">
        <h3 className="logo">Melodypalette</h3>
        <div className='navbar-box'>
          <ul>
            <li><a href="#section1">제목 또는 아티스트 검색</a></li>
            <li><a href="#section2">실시간 top 랭킹</a></li>
            <li><a href="#section3">Playlist</a></li>
            <li><a href="#profile" onClick={handleProfileClick}>
                {isLoggedIn ? '프로필' : '로그인'}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
