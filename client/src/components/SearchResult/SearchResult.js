import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const [searchTerm, setSearchTerm] = useState(''); // 입력한 검색어 상태 관리
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const query = params.get('query');
  const accessToken = 'BQCLkW3vOqrZgOr6il8XejbOAjonpKmIkFHx4Fn1njvZYoLhYkRywDMnMYol1bTWdzYaqmXVWDZr2oJZ0EdRFhFXx74R0xw32vLx_cZw_q4sQTp-c-dhbpS4zF48FoaBi-Bx0-_A3ovuxLi1c9Daoe_mXiYhDtO-Sd6AhdQVEUUKheJuQR41Ej7xR4ld8ROpVqTz6VRVsxChaauMwAB5jhQeGmgnUH-YUxAo_wq7';

  useEffect(() => {
    if (query) {
      setSearchTerm(query); // URL에서 받아온 쿼리를 searchTerm 상태에 설정
    }
  }, [query]);

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

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handlePlay = (track) => {
    console.log('Playing track:', track);
    const uri = track.uri; // Spotify URI
    navigate(`/player?uri=${encodeURIComponent(uri)}&token=${encodeURIComponent(accessToken)}&name=${encodeURIComponent(track.name)}&artist=${encodeURIComponent(track.artists.map(artist => artist.name).join(', '))}&albumImage=${encodeURIComponent(track.album.images[0]?.url)}`);
  };
  

  return (
    <div className='SearchResult'>
      <Navbar />
      <section className='search-container2'>
        <div className='search-container'>
        <input
            type="text"
            className="search-input"
            placeholder="검색어를 입력하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // 입력 변화에 따른 상태 업데이트
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // 엔터 키로도 검색 가능
          />
          <button className="search-button" onClick={handleSearch}>검색</button>
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
                <button 
                  className='play-button'
                  onClick={() => handlePlay(track)}>
                    ▶️ 재생
                </button>
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
