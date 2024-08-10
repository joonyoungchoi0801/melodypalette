import './ArtistSelection.css';
import { useState, useEffect } from 'react';

function ArtistSelection() {
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [artists, setArtists] = useState([]);

// API를 사용해 아티스트 데이터 가져오기
async function fetchSpotifyToken() {
  try {
    const response = await fetch('http://localhost:5000/api/token');
    const data = await response.json();

    if (data.access_token) {
      return data.access_token;
    } else {
      throw new Error('No access token found');
    }
  } catch (error) {
    console.error('Error fetching token:', error.message);
  }
}

// 클라이언트에서 토큰을 받아오고 이를 활용해 Spotify API에 요청
useEffect(() => {
  const getTopArtists = async () => {
    const token = await fetchSpotifyToken();
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/top-artists?token=${token}`);
      const artistsData = await response.json();
      console.log('Artists data:', artistsData); // 이미지 URL 디버깅용
      setArtists(artistsData); // 상태에 아티스트 데이터 설정
    } catch (error) {
      console.error('Error fetching top artists:', error.message);
    }
  };

  getTopArtists();
}, []);

//아티스트 이미지 선택하거나 해제할 때
const toggleSelectArtist = (artistId) => {
  if (selectedArtists.includes(artistId)) {
    setSelectedArtists((prevSelected) =>
      prevSelected.filter((id) => id !== artistId)
    );
    setErrorMessage(''); 
  } else {
    if (selectedArtists.length < 5) {
      setSelectedArtists((prevSelected) => [...prevSelected, artistId]);
      setErrorMessage(''); 
    } else {
      setErrorMessage('최대 5개의 아티스트만 선택할 수 있습니다.'); 
    }
  }
};

  return (
    <div className='ArtistSelection'>
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
      <div className='select-container'>
        <h1 className='page-title'>선호하는 아티스트</h1>
        <div className='select-complete'>
          <span className='select-limit'>최대 5개 이하 선택</span>
          <button className='select-complete-btn'>선택 완료</button>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className='select-list'>
        {artists.map((artist) => (
  <div
    key={artist.id}
    className={`artist-item ${selectedArtists.includes(artist.id) ? 'selected' : ''}`}
    onClick={() => toggleSelectArtist(artist.id)}
  >
    <div className='artist-image-container'>
      <img
        src={artist.imageUrl || 'default-image-url.jpg'} // 기본 이미지 URL 추가
        alt={artist.name}
        className='artist-image'
      />
    </div>
    <p className='artist-name'>{artist.name}</p>
  </div>
))}
        </div>
      </div>
    </div>
  );
}

export default ArtistSelection;
