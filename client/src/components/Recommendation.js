import React from 'react';
import { Link } from 'react-router-dom';
import './Recommendation.css';

function Recommendation() {
  return (
    <div className='Recommendation'>
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
