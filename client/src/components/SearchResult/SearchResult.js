import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import './SearchResult.css';

// Access Token 가져오기
async function fetchSpotifyToken() {
  try {
    const response = await fetch('http://localhost:5000/api/token'); // 서버에서 토큰을 가져오는 API
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error fetching token:', error.message);
    return null; // 오류 발생 시 null 반환
  }
}

// Spotify API에서 검색 결과 가져오기
async function fetchSearchResults(query, token) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,artist&limit=5`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching search results:', error.message);
    return null;
  }
}

function SearchResult() {
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get('query');

  useEffect(() => {
    const getSearchResults = async () => {
      const token = await fetchSpotifyToken(); // 토큰 가져오기 함수 재사용
      if (!token) return;

      const results = await fetchSearchResults(query, token);
      if (results) {
        setTracks(results.tracks.items);
        setArtists(results.artists.items);
      }
      setLoading(false);
    };

    getSearchResults();
  }, [query]);

  return (
    <div className='SearchResult'>
      <Navbar />
      <section className='search-container2'>
        <div className='search-container'>
          <input type="text" className="search-input" placeholder="검색어를 입력하세요" />
          <button className="search-button">검색</button>
        </div>
      </section>
      <section className='result-song-container'>
        <p><span className='search-keyword'>"{query}"</span>에 대한 검색 결과입니다.</p>
        <h2>곡</h2>
        <div className='result-song-list'>
          {loading ? (
            <p>로딩 중...</p>
          ) : (
            tracks.map(track => (
              <div key={track.id} className='result-song-line'>
                <img className='album-img2' src={track.album.images[0]?.url} alt={track.name} />
                <p>{track.name}</p>
                <p>{track.artists.map(artist => artist.name).join(', ')}</p>
                <p><a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">듣기</a></p>
              </div>
            ))
          )}
        </div>
      </section>
      <section className='result-singer-container'>
        <h2>아티스트</h2>
        <div className='singer-img-container'>
          {loading ? (
            <p>로딩 중...</p>
          ) : (
            artists.map(artist => (
              <div key={artist.id} className='singer-img-box'>
                <img className='singer-img' src={artist.images[0]?.url} alt={artist.name} />
                <p className='singer-name'>{artist.name}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default SearchResult;
