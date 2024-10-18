import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Main.css';
import Navbar from '../Navbar/Navbar';

// Hot Hits Korea Playlist ID (정확한 ID인지 확인 필요)
const HOT_HITS_KOREA_PLAYLIST_ID = '37i9dQZF1DWT9uTRZAYj0c';

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

// 실시간 차트 데이터를 가져오는 함수
async function fetchTopTracksFromPlaylist(playlistId, token) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.items) {
      console.error('Error: data.items is undefined', data);
      return []; // data.items가 없는 경우 빈 배열 반환
    }

    // 상위 15곡만 선택
    return data.items.slice(0, 15).map(item => ({
      id: item.track.id,
      name: item.track.name,
      artist: item.track.artists.map(artist => artist.name).join(', '),
      albumCover: item.track.album.images[0].url, // 앨범 이미지 URL
    }));
  } catch (error) {
    console.error('Error fetching playlist tracks:', error.message);
    return []; // 오류 발생 시 빈 배열 반환
  }
}

// 배열을 5개씩 나누는 함수
function chunkArray(array, size) {
  const chunkedArr = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArr.push(array.slice(i, i + size));
  }
  return chunkedArr;
}

function Main() {
  const [searchTerm, setSearchTerm] = useState('');
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleSearch = () => {
    console.log('Search button clicked with term:', searchTerm);
    navigate(`/search?query=${searchTerm}`);
  };

  const handleRecommendButtonClick = () => {
    console.log('Recommend button clicked');
    navigate('/RecommendationOptions');
  };

  useEffect(() => {
    const getTopTracks = async () => {
      const token = await fetchSpotifyToken();
      if (!token) return;

      const tracks = await fetchTopTracksFromPlaylist(HOT_HITS_KOREA_PLAYLIST_ID, token);
      setTopTracks(tracks);
      setLoading(false);
    };

    getTopTracks();
  }, []);

  // Top tracks를 5개씩 나누기
  const trackChunks = chunkArray(topTracks, 5);

  return (
    <div className="Main">
      <Navbar />
      <section className="section1" id="main-section">
        <div className="intro-container">
          <h3>Melodypalette에서 새로운 음악을 만나보세요</h3>
          <p className='intro-text'>음악 취향을 분석하여, 당신에게 딱 맞는 곡을 추천해드립니다.</p>
          <button className="recommend-button" onClick={handleRecommendButtonClick}>음악 추천받기</button>
        </div>
      </section>

      <section className="section2" id="features-section">
        <div className="features-container">
          <h2>Melodypalette의 주요 기능</h2>
          <div className="feature-list">
            <div className="feature-item">
              <h3>취향에 맞는 음악 추천</h3>
              <img src="/images/feature1.png" alt="feature1"/>
              <div className='feature-box'>
                <p>선호하는 아티스트 또는 장르를 선택해,<br /> 당신만의 음악을 추천받을 수 있습니다</p>
              </div>
            </div>
            <div className="feature-item">
              <h3>나만의 플레이리스트 만들기</h3>
              <img src="/images/feature2.png" alt="feature2"/>
              <div className='feature-box'>
                <p>추천받은 노래 중 맘에 드는 곡을 모아 <br /> 나만의 플레이리스트를 만들 수 있습니다</p>
              </div>
            </div>
            <div className="feature-item">
              <h3>음악 재생</h3>
              <img src="/images/feature3.png" alt="feature3"/>
              <div className='feature-box'>
                <p>추천된 곡들을 바로 들어보면서<br/> 음악을 즐길 수 있습니다</p>
              </div>
            </div>
            <div className="feature-item">
              <h3>좋아요 표시하기</h3>
              <img src="/images/feature4.png" alt="feature4"/>
              <div className='feature-box'>
                <p>마음에 드는 곡에 좋아요 표시를 해<br/> 나만의 컬렉션을 만들어보세요</p>
              </div>
            </div>
            <div className="feature-item">
              <h3>실시간 음악 랭킹</h3>
              <img src="/images/feature5.png" alt="feature5"/>
              <div className='feature-box'>
                <p>현재 인기 있는 음악을 실시간으로 확인하고, 최신 트렌드를 파악할 수 있습니다</p>
              </div>
            </div>
            <div className="feature-item">
              <h3>음악 및 아티스트 검색</h3>
              <img src="/images/feature6.png" alt="feature6"/>
              <div className='feature-box'>
                <p>원하는 음악이나 아티스트를 검색하여 쉽게 찾아 듣고, 즐길 수 있습니다</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section3" id="search-section">
        <div className='second-container'>
          <h2 className='second-container-title'>제목 또는 아티스트 검색</h2>
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
        </div>
      </section>

      <section className="section4" id="rank-section">
        <div className='third-container'>
          <h2 className='third-container-title'>실시간 TOP 랭킹</h2>
          <div className='chart-container'>
            {loading ? (
              <div className="loading-spinner">로딩 중...</div>
            ) : (
              trackChunks.map((chunk, chunkIndex) => (
                <div key={chunkIndex} className='chartline'>
                  {chunk.map((track, index) => (
                    <div key={index} className='chart-box'>
                      <span className='rank'>{chunkIndex * 5 + index + 1}</span>
                      <img className='album-img' src={track.albumCover} alt={`${track.name} album cover`} />
                      <div className='info'>
                        <h4 className='title'>{track.name}</h4>
                        <span className='artist'>{track.artist}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Main;
