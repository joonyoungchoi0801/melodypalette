import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Search.css';

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const artists = ["aespa", "BLACKPINK", "QWER", "IU", "DAY6", "NewJeans", "LE SSERAFIM", "KISS OF LIFE", "RIIZE"];

  const handleSearch = () => {
    console.log('Search button clicked with term:', searchTerm);
    navigate(`/searchResult?query=${searchTerm}`);
  };

  return (
    <section className="section3" id="search-section">
      <div className='second-container'>
        <h2 className='second-container-title'>검색</h2>
        <div className='search-container'>
          <input
            type="text"
            className="search-input"
            placeholder="검색어를 입력하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>검색</button>
        </div>
        <p>최근 인기 아티스트</p>
        <div className="artists-marquee">
          <div className="artists-marquee-inner">
            {artists.concat(artists).map((artist, index) => (
              <div className='artist-name-box' key={index}>
                <span className="artist-name">{artist}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Search;