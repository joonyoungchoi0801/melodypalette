import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import './Recommendation.css';
import Player from '../Player/Player';
import PlaylistPopup from '../PlaylistPopup/PlaylistPopup'; 

function Recommendation() {
  const { state } = useLocation(); // 상태에서 추천 결과 가져오기
  const recommendations = state?.recommendations || [];
  const [accessToken, setAccessToken] = useState(''); // 서버에서 받아온 액세스 토큰 상태 관리
  const [selectedTrackUri] = useState(''); // 재생할 곡 URI 상태 관리
  const [likes, setLikes] = useState({}); // 좋아요 상태 관리
  const [dislikes, setDislikes] = useState({}); // 싫어요 상태 관리
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false); // 플레이리스트 선택 창 열기/닫기
  const [selectedTrack, setSelectedTrack] = useState(null); // 추가할 트랙 정보
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setAccessToken(token);
    } else {
      console.error('Access token is missing');
    }
  }, []);
  
  // 플레이리스트를 불러오기 위한 예시 (로컬 스토리지 또는 API에서 가져옴)
  const userPlaylists = JSON.parse(localStorage.getItem('userPlaylists')) || [];

  // 좋아요 버튼 클릭 핸들러
  const handleLike = (trackId) => {
    setLikes(prevLikes => ({
      ...prevLikes,
      [trackId]: !prevLikes[trackId], // 토글 기능
    }));
    if (dislikes[trackId]) {
      setDislikes(prevDislikes => ({
        ...prevDislikes,
        [trackId]: false,
      }));
    }
  };

  // 싫어요 버튼 클릭 핸들러
  const handleDislike = (trackId) => {
    setDislikes(prevDislikes => ({
      ...prevDislikes,
      [trackId]: !prevDislikes[trackId],
    }));
    if (likes[trackId]) {
      setLikes(prevLikes => ({
        ...prevLikes,
        [trackId]: false,
      }));
    }
  };

  // 재생 버튼 클릭 핸들러
  const handlePlay = (track) => {
    const uri = track.spotifyUrl;
    navigate(`/player?uri=${encodeURIComponent(uri)}&token=${encodeURIComponent(accessToken)}&name=${encodeURIComponent(track.name)}&artist=${encodeURIComponent(track.artist)}&albumImage=${encodeURIComponent(track.albumImage)}`);
  };

  // 추가 버튼 클릭 핸들러
  const handleAddToPlaylist = (track) => {
    setSelectedTrack(track); // 추가할 트랙 저장
    setIsPlaylistOpen(true); // 플레이리스트 선택 창 열기
  };

  // 플레이리스트에 곡 추가
  const handleSelectPlaylist = (playlistId) => {
    if (!selectedTrack) return;

    const updatedPlaylists = userPlaylists.map((playlist) => {
      if (playlist.id === playlistId) {
        return { 
          ...playlist, 
          tracks: [...playlist.tracks, selectedTrack] // 선택한 트랙 추가
        };
      }
      return playlist;
    });

    localStorage.setItem('userPlaylists', JSON.stringify(updatedPlaylists)); // 로컬 스토리지 업데이트
    setIsPlaylistOpen(false); // 창 닫기
  };

  // 추천 완료 버튼 클릭 핸들러
  const handleFinish = () => {
    navigate('/'); // 메인 페이지로 이동
  };

  return (
    <div className='Recommendation'>
      <Navbar />
      <h1 className='page-title'>추천 곡</h1>
      <div>
    </div>
      <div className='recommendations-list'>
        {recommendations.length > 0 ? (
            recommendations.map((track, index) => (
              <div key={index} className='recommendation-item'>
                <img 
                  src={track.albumImage || 'default_album_image_url.jpg'} 
                  alt={`${track.name} album cover`} 
                  className='album-image'
                />
                <div className='recommendation-info'>
                  <h1 className='recommendation-track'>{track.name || 'No Title'}</h1>
                  <p className='recommendation-artist'>{track.artist || 'Unknown Artist'}</p>
                  <div className='recommendation-actions'>
                    <button 
                      className={`like-button ${likes[track.id] ? 'liked' : ''}`}
                      onClick={() => handleLike(track.id)}
                    >
                      👍 좋아요
                    </button>
                    <button 
                      className={`dislike-button ${dislikes[track.id] ? 'disliked' : ''}`}
                      onClick={() => handleDislike(track.id)}
                    >
                      👎 싫어요
                    </button>
                    <button 
                      className='play-button'
                      onClick={() => handlePlay(track)}
                    >
                      ▶️ 재생
                    </button>
                    <button 
                      className='add-button' // 추가 버튼
                      onClick={() => handleAddToPlaylist(track)}
                    >
                      ➕ 추가
                    </button>
                  </div>
                </div>
              </div>
          ))
        ) : (
          <p className='no-recommendations'>추천할 항목이 없습니다.</p>
        )}
      </div>

      {isPlaylistOpen && (
        <PlaylistPopup 
          playlists={userPlaylists} 
          onSelect={handleSelectPlaylist} 
          onClose={() => setIsPlaylistOpen(false)} // 팝업 닫기
        />
      )}

      <div className='recommendation-button-container'>
        <button className='recommendation-finished' onClick={handleFinish}>추천 완료</button>
      </div>

      {selectedTrackUri && <Player token={accessToken} trackUri={selectedTrackUri} />}
    </div>
  );
}

export default Recommendation;
