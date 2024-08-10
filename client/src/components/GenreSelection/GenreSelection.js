import './GenreSelection.css';
import { useState, useEffect } from 'react';

function GenreSelection() {
  const [selectGenres, setSelectGenres] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  // Spotify API에서 액세스 토큰을 가져오는 함수
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

  // Spotify API에서 장르 데이터를 가져오는 함수
  useEffect(() => {
    const fetchGenres = async () => {
      const token = await fetchSpotifyToken();
      if (!token) return;
  
      try {
        const response = await fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = await response.json();
        if (data.genres && Array.isArray(data.genres)) {
          // 특정 장르만 필터링하여 가져옵니다.
          const selectedGenres = ['pop', 'hip-hop', 'jazz', 'classical', 'edm', 'r-n-b', 'happy', 'blues', 'piano', 'indie-pop', 'indie', 'dance', 'chill', 'rainy-day', 'drum-and-bass', 'groove', 'guitar', 'disney', 'j-pop', 'movies', 'sad', 'singer-songwriter', 'sleep', 'summer']; //특정 장르
          const genreList = data.genres
            .filter(genre => selectedGenres.includes(genre))
            .map((genre, index) => ({
              id: index + 1, // 임의의 ID 할당
              name: genre,
            }));
          setGenres(genreList);
        } else {
          console.error('API 응답이 배열이 아닙니다:', data);
        }
      } catch (error) {
        console.error('Error fetching genres:', error.message);
      } finally {
        setLoading(false); // 로딩 완료
      }
    };
  
    fetchGenres();
  }, []);
  
  // 장르 선택 토글 함수
  const toggleSelectGenre = (genreId) => {
    if (selectGenres.includes(genreId)) {
      setSelectGenres((preSelected) =>
        preSelected.filter((id) => id !== genreId)
      );
      setErrorMessage('');
    } else {
      if (selectGenres.length < 5) {
        setSelectGenres((preSelected) => [...preSelected, genreId]);
        setErrorMessage('');
      } else {
        setErrorMessage('최대 5개의 장르만 선택할 수 있습니다.');
      }
    }
  };

  return (
    <div className='GenreSelection'>
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
        <h1 className='page-title'>선호하는 장르</h1>
        <div className='select-complete'>
          <span className='select-limit'>최대 5개 이하 선택</span>
          <button className='select-complete-btn'>선택 완료</button>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {loading ? (
          <div className="loading-spinner">로딩 중...</div>
        ) : (
          <div className='genre-grid'>
            {genres.map((genre) => (
              <div
                key={genre.id}
                className={`genre-item ${selectGenres.includes(genre.id) ? 'selected' : ''}`}
                onClick={() => toggleSelectGenre(genre.id)}
              >
                <p className='genre-name'>{genre.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GenreSelection;
