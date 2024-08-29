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
      <section className="section black-background1" id="section2">
        <div className='second-container'>
          <h2>제목 또는 아티스트 검색</h2>
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
      <section className="section black-background2" id="section3">
        <div className='third-container'>
          <h2>실시간 TOP 랭킹</h2>
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
