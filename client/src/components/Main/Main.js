import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Main.css';
import LoginPopup from '../LoginPopup/LoginPopup';
import SignupPopup from '../SignupPopup/SignupPopup';
import ProfilePopup from '../ProfilePopup/ProfilePopup';

const albumCovers = [
  // 예시 앨범 이미지 URL
  'https://img.etnews.com/news/article/2024/05/23/cms_temp_article_23120344835638.jpg',
  'http://img.etoday.co.kr/pto_db/2024/05/20240509102337_2022568_1200_1800.jpg',
  'https://cdn.sports.hankooki.com/news/photo/202404/6861711_1079508_493.jpg',
  'https://cdn.tenbizt.com/tenbizt/2024/03/11190353/%EC%95%84%EC%9D%BC%EB%A6%BF_%EB%AF%BC%EC%A3%BC-640x427.jpg',
  'https://image.ytn.co.kr/general/jpg/2024/0125/202401251017584548_d.jpg'
];

function Main() {
  const [navbarBackground, setNavbarBackground] = useState('transparent');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
  const [userEmail, setUserEmail] = useState(''); // 로그인된 사용자 이메일
  const [username, setUsername] = useState('');
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);

  const navigate = useNavigate();


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

  const handleSearch = () => {
    navigate(`/search?query=${searchTerm}`);
  };

  const handleRecommendButtonClick = () => {
    navigate('/recommendation'); 
  };

  const openLoginPopup = () => setIsLoginPopupOpen(true);
  const closeLoginPopup = () => setIsLoginPopupOpen(false);


  const openSignupPopup = () => setIsSignupOpen(true);
  const closeSignupPopup = () => setIsSignupOpen(false);

  const openProfilePopup = () => setIsProfilePopupOpen(true);
  const closeProfilePopup = () => setIsProfilePopupOpen(false);

  useEffect(() => {
    console.log('User email:', userEmail);
    console.log('Username:', username);
  }, [userEmail, username]);
  

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

  return (
    <div className="Main">
      <nav className="navbar" style={{ backgroundColor: navbarBackground }}>
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
      <section className="section gradient-background">
        <div className="intro-container">
          <h3>Melodypalette에서 새로운 음악을 만나보세요</h3>
          <p className='intro-text'>음악 취향을 분석하여, 당신에게 딱 맞는 곡을 추천해드립니다.</p>
          <button className="recommend-button" onClick={handleRecommendButtonClick}>음악 추천받기</button>
          <div className="album-container">
            {albumCovers.map((cover, index) => (
              <div key={index} className="album">
                <img src={cover} alt={`Album ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section black-background1">
        <div className='second-container'>
          <h2>제목 또는 아티스트 검색</h2>
          <div className='search-container'>
            <input type="text" className="search-input" placeholder="검색어를 입력하세요" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
            <button className="search-button" onClick={handleSearch}>검색</button>
          </div>
        </div>
      </section>
      <section className="section black-background2">
        <div className='third-container'>
          <h2>실시간 TOP 랭킹</h2>
          <div className='chart-container'>
            <div className='chartline'>
              <div className='chart-box'>
                <span className='rank'>1</span>
                <div className='album-img'></div>
                <div className='info'>
                  <h4 className='title'>노래 제목</h4>
                  <span className='artist'>아티스트</span>
                </div>
              </div>
              <div className='chart-box'>
                <span className='rank'>2</span>
                <div className='album-img'></div>
                <div className='info'>
                  <h4 className='title'>노래 제목</h4>
                  <span className='artist'>아티스트</span>
                </div>
              </div>
              <div className='chart-box'>
                <span className='rank'>3</span>
                <div className='album-img'></div>
                <div className='info'>
                  <h4 className='title'>노래 제목</h4>
                  <span className='artist'>아티스트</span>
                </div>
              </div>
              <div className='chart-box'>
                <span className='rank'>4</span>
                <div className='album-img'></div>
                <div className='info'>
                  <h4 className='title'>노래 제목</h4>
                  <span className='artist'>아티스트</span>
                </div>
              </div>
              <div className='chart-box'>
                <span className='rank'>5</span>
                <div className='album-img'></div>
                <div className='info'>
                  <h4 className='title'>노래 제목</h4>
                  <span className='artist'>아티스트</span>
                </div>
              </div>
            </div>
            <div className='chartline'>
              <div className='chart-box'>
                <span className='rank'>6</span>
                <div className='album-img'></div>
                <div className='info'>
                  <h4 className='title'>노래 제목</h4>
                  <span className='artist'>아티스트</span>
                </div>
              </div>
              <div className='chart-box'>
                <span className='rank'>7</span>
                <div className='album-img'></div>
                <div className='info'>
                  <h4 className='title'>노래 제목</h4>
                  <span className='artist'>아티스트</span>
                </div>
              </div>
              <div className='chart-box'>
                <span className='rank'>8</span>
                <div className='album-img'></div>
                <div className='info'>
                  <h4 className='title'>노래 제목</h4>
                  <span className='artist'>아티스트</span>
                </div>
              </div>              
              <div className='chart-box'>
                <span className='rank'>9</span>
                <div className='album-img'></div>
                <div className='info'>
                  <h4 className='title'>노래 제목</h4>
                  <span className='artist'>아티스트</span>
                </div>
              </div>              
              <div className='chart-box'>
                <span className='rank'>10</span>
                <div className='album-img'></div>
                <div className='info'>
                  <h4 className='title'>노래 제목</h4>
                  <span className='artist'>아티스트</span>
                </div>
              </div>            
            </div>
            <div className='chartline'>
            <div className='chart-box'>
                <span className='rank'>11</span>
                <div className='album-img'></div>
                <div className='info'>
                  <h4 className='title'>노래 제목</h4>
                  <span className='artist'>아티스트</span>
                </div>
              </div>              
              <div className='chart-box'>
                <span className='rank'>12</span>
                <div className='album-img'></div>
                <div className='info'>
                  <h4 className='title'>노래 제목</h4>
                  <span className='artist'>아티스트</span>
                </div>
              </div>              
              <div className='chart-box'>
                <span className='rank'>13</span>
                <div className='album-img'></div>
                <div className='info'>
                  <h4 className='title'>노래 제목</h4>
                  <span className='artist'>아티스트</span>
                </div>
              </div>              
              <div className='chart-box'>
                <span className='rank'>14</span>
                <div className='album-img'></div>
                <div className='info'>
                  <h4 className='title'>노래 제목</h4>
                  <span className='artist'>아티스트</span>
                </div>
              </div>              
              <div className='chart-box'>
                <span className='rank'>15</span>
                <div className='album-img'></div>
                <div className='info'>
                  <h4 className='title'>노래 제목</h4>
                  <span className='artist'>아티스트</span>
                </div>
              </div>            
            </div>
          </div>
        </div>
      </section>

      <LoginPopup 
      isOpen={isLoginPopupOpen} 
      onClose={closeLoginPopup} 
      switchToSignup={switchToSignup}
      onLoginSuccess={handleLoginSuccess} />

      <SignupPopup 
      isOpen={isSignupOpen} 
      onClose={closeSignupPopup} 
      openLoginPopup={() => setIsLoginPopupOpen(true)} />

      <ProfilePopup 
        isOpen={isProfilePopupOpen} 
        onClose={closeProfilePopup} 
        userEmail={userEmail}
        username={username} />
    </div>
  );
}

export default Main;