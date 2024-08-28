import './GenreSelection.css';
import { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { getTracksByGenre } from '../../services/RecommendationService';

function GenreSelection() {
  const [selectGenres, setSelectGenres] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingRecommendations, setFetchingRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();

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
          const selectedGenres = ['pop', 'hip-hop', 'jazz', 'classical', 'edm', 'r-n-b', 'happy', 'blues', 'piano', 'indie-pop', 'indie', 'dance', 'chill', 'rainy-day', 'drum-and-bass', 'groove', 'guitar', 'disney', 'j-pop', 'movies', 'sad', 'singer-songwriter', 'sleep', 'summer'];
          const genreList = data.genres
            .filter(genre => selectedGenres.includes(genre))
            .map((genre, index) => ({
              id: index + 1,
              name: genre,
            }));
          setGenres(genreList);
        } else {
          console.error('API 응답이 배열이 아닙니다:', data);
        }
      } catch (error) {
        console.error('Error fetching genres:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (selectGenres.length > 0) {
        setFetchingRecommendations(true);
        try {
          const token = await fetchSpotifyToken();
          const genreIds = selectGenres.map(id => genres.find(genre => genre.id === id)?.name);
          const recommendedTracks = await getTracksByGenre(genreIds, token);
          setRecommendations(recommendedTracks);
        } catch (error) {
          console.error('Error fetching recommendations:', error.message);
        } finally {
          setFetchingRecommendations(false);
        }
      }
    };

    fetchRecommendations();
  }, [selectGenres, genres]); // Added genres as a dependency

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

  const handleSelectComplete = () => {
    if (selectGenres.length === 0) {
      setErrorMessage('장르를 선택하세요.');
      return;
    }

    navigate('/recommendations', { state: { recommendations } });
  };

  return (
    <div className='GenreSelection'>
      <Navbar />
      <div className='select-container'>
        <h1 className='page-title'>선호하는 장르</h1>
        <div className='select-complete'>
          <span className='select-limit'>최대 5개 이하 선택</span>
          <button
            className='select-complete-btn'
            onClick={handleSelectComplete}
            disabled={fetchingRecommendations}
          >
            선택 완료
          </button>
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
        {fetchingRecommendations && <div className="loading-spinner">추천 곡 로딩 중...</div>}
      </div>
    </div>
  );
}

export default GenreSelection;
