import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Main.css';
import Navbar from '../Navbar/Navbar';

const albumCovers = [
  'https://img.etnews.com/news/article/2024/05/23/cms_temp_article_23120344835638.jpg',
  'http://img.etoday.co.kr/pto_db/2024/05/20240509102337_2022568_1200_1800.jpg',
  'https://cdn.sports.hankooki.com/news/photo/202404/6861711_1079508_493.jpg',
  'https://cdn.tenbizt.com/tenbizt/2024/03/11190353/%EC%95%84%EC%9D%BC%EB%A6%BF_%EB%AF%BC%EC%A3%BC-640x427.jpg',
  'https://image.ytn.co.kr/general/jpg/2024/0125/202401251017584548_d.jpg'
];

function Main() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    console.log('Search button clicked with term:', searchTerm);
    navigate(`/search?query=${searchTerm}`);
  };

  const handleRecommendButtonClick = () => {
    console.log('Recommend button clicked');
    navigate('/recommendation');
  };

  useEffect(() => {
    console.log('Main component rendered');
  }, []);

  return (
    <div className="Main">
      <Navbar/>
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
              {Array.from({ length: 15 }, (_, index) => (
                <div key={index} className='chart-box'>
                  <span className='rank'>{index + 1}</span>
                  <div className='album-img'></div>
                  <div className='info'>
                    <h4 className='title'>노래 제목</h4>
                    <span className='artist'>아티스트</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Main;
