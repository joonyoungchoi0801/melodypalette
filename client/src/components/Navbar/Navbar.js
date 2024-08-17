import React from 'react';
import './Navbar.css'; // 스타일 파일을 추가합니다.

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h3 className="logo">Melodypalette</h3>
        <div className='navbar-box'>
          <ul>
            <li><a href="#section1">제목 또는 아티스트 검색</a></li>
            <li><a href="#section2">실시간 top 랭킹</a></li>
            <li><a href="#section3">Playlist</a></li>
            <li><a href="#section4">프로필</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
