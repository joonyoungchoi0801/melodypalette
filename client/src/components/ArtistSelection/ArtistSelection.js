import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import { getTrackRecommendationsWithCosineSimilarity } from '../../services/RecommendationService';
import { useNavigate } from 'react-router-dom';
import './ArtistSelection.css';

function ArtistSelection() {
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false); // 초기값을 false로 설정
  const navigate = useNavigate();

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
        console.log('Artists data:', artistsData);
        if (Array.isArray(artistsData)) {
          setArtists(artistsData);
        } else {
          console.error('API 응답이 배열이 아닙니다:', artistsData);
        }
      } catch (error) {
        console.error('Error fetching top artists:', error.message);
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    getTopArtists();
  }, []);

  // 아티스트 이미지 선택하거나 해제할 때
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

  // 선택 완료 버튼 클릭 시
  const handleSelectComplete = async () => {
    if (selectedArtists.length === 0) {
      setErrorMessage('아티스트를 선택하세요.');
      return;
    }

    setLoading(true); // 로딩 시작

    const token = await fetchSpotifyToken();
    if (!token) {
      setLoading(false); // 로딩 중지
      return;
    }

    try {
      // 추천을 가져오는 함수 호출
      const recommendations = await getTrackRecommendationsWithCosineSimilarity(selectedArtists, token);
      console.log('Recommendations:', recommendations);

      // 추천 페이지로 이동하며 추천 결과를 쿼리 파라미터로 전달
      navigate('/recommendations', { state: { recommendations } });
    } catch (error) {
      console.error('Error fetching recommendations:', error.message);
    } finally {
      setLoading(false); // 로딩 중지
    }
  };

  return (
    <div className='ArtistSelection'>
      <Navbar />
      <div className='select-container'>
        <h1 className='page-title'>선호하는 아티스트</h1>
        <div className='select-complete'>
          <span className='select-limit'>최대 5개 이하 선택</span>
          <button className='select-complete-btn' onClick={handleSelectComplete}>선택 완료</button>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {loading ? (
          <div className='loading'>
            <div className='spinner'></div>
            <p className='loading-text'>추천 진행 중...</p>
          </div>
        ) : (
          <div className='select-list'>
            {artists.map((artist) => (
              <div
                key={artist.id}
                className={`artist-item ${selectedArtists.includes(artist.id) ? 'selected' : ''}`}
                onClick={() => toggleSelectArtist(artist.id)}
              >
                <div className='artist-image-container'>
                  <img src={artist.imageUrl} alt={artist.name} className='artist-image' />
                </div>
                <p className='artist-name'>{artist.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ArtistSelection;
