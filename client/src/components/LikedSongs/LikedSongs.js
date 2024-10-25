import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../Navbar/Navbar';
import Player from '../Player/Player';
import './LikedSongs.css';

const LikedSongs = () => {
  const { userProfile } = useAuth(); // 사용자 프로필 불러오기
  const userId = userProfile?.id; // 사용자 ID
  const [accessToken, setAccessToken] = useState(''); // 엑세스 토큰 상태 관리
  const [likedTracks, setLikedTracks] = useState([]); // 좋아요한 트랙들 상태 관리
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [selectedTrackUri, setSelectedTrackUri] = useState(''); // 재생할 곡 URI 상태 관리
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setAccessToken(token);
    } else {
      console.error('Access token is missing');
    }
  }, []);

  useEffect(() => {
    if (userId) {
      // 사용자 ID를 기반으로 좋아요한 트랙 가져오기
      fetch(`http://localhost:5000/api/likes?userId=${userId}`)
        .then(response => response.json())
        .then(data => {
          console.log(data.likedTracks);
          setLikedTracks(data.likedTracks);
          setLoading(false); // 로딩 완료
        })
        .catch(error => {
          console.error('좋아요한 곡을 불러오는데 실패했습니다:', error);
          setLoading(false);
        });
    }
  }, [userId]);

  if (loading) {
    return <p>로딩 중...</p>;
  }

  // 재생 버튼 클릭 핸들러
  const handlePlay = (track) => {
    const uri = track.uri;
    const albumImage = track.album?.images?.[0]?.url || '/images/default_album_image.png'; // 앨범 이미지
    const artist = track.artists?.[0]?.name || 'Unknown Artist'; // 아티스트 이름

    setSelectedTrackUri(uri);

    // 정보를 전달하며 Player로 이동
    navigate(`/player?uri=${encodeURIComponent(uri)}&token=${encodeURIComponent(accessToken)}&name=${encodeURIComponent(track.name)}&artist=${encodeURIComponent(artist)}&albumImage=${encodeURIComponent(albumImage)}`);
  };

  return (
    <div className="liked-songs">
      <Navbar />
      <h2>좋아요한 노래</h2>
      {likedTracks.length > 0 ? (
        <ul className="liked-songs-list">
          {likedTracks.map((track, index) => (
            <li key={track.id || index} className="liked-song-item">
              <img src={track.album?.images?.[0]?.url || '/images/default_album_image.png'} alt={track.name || 'Unknown Title'} className="liked-song-image" />
              <div className="liked-song-info">
                <h3>{track.name || 'Unknown Title'}</h3>
                <p>{track.artists?.[0]?.name || 'Unknown Artist'}</p>
              </div>
              <button
                className='play-button'
                id='liked-play-btn'
                onClick={() => handlePlay(track)}
              >
                ▶️ 재생
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>좋아요한 곡이 없습니다.</p>
      )}
      {selectedTrackUri && <Player token={accessToken} trackUri={selectedTrackUri} />}

    </div>
  );
};

export default LikedSongs;
