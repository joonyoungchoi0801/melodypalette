import React, { useEffect, useState } from 'react';
import './Main.css';
// import Login from './Login';

function Main() {
  const [navbarBackground, setNavbarBackground] = useState('transparent');

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > window.innerHeight) {
      setNavbarBackground('black');
    } else {
      setNavbarBackground('transparent');
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="Main">
      <nav className="navbar" style={{ backgroundColor: navbarBackground }}>
      <div className="navbar-container">
          <h3 className="logo">Melodypalette</h3>
          <div className='navbar-box'>
            <ul>
              <li><a href="#section1">음악 검색</a></li>
              <li><a href="#section2">실시간 top 랭킹</a></li>
              <li><a href="#section3">Playlist</a></li>
              <li><a href="#section4">프로필</a></li>
            </ul>
          </div>
        </div>
      </nav>
      <section className="section gradient-background">
        <div className="intro-container">
          <h1>Welcome to Melodypalette</h1>
          <p>Your personalized music journey starts here.<br /> Discover new music, track top charts, and create your own playlists.</p>
          <button className="recommend-button">음악 추천받기</button>
        </div>
      </section>
      <section className="section black-background">
        <h2>Search Music</h2>
      </section>
      <section className="section black-background">
        <h2>Music TOP 30 Ranking</h2>
      </section>
    </div>
  );
}

export default Main;