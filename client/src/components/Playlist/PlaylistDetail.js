import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PlaylistDetail.css';
import Navbar from '../Navbar/Navbar';

function PlaylistDetail() {
  const { id } = useParams(); // URL에서 플레이리스트 ID를 가져옴
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [accessToken, setAccessToken] = useState(''); // 서버에서 받아온 액세스 토큰 상태 관리

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setAccessToken(token);
    } else {
      console.error('Access token is missing');
    }
  }, []);

  // 해당 플레이리스트를 로드하는 함수
  useEffect(() => {
    // 로컬 스토리지에 저장된 플레이리스트를 가져옴
    const storedPlaylists = JSON.parse(localStorage.getItem('userPlaylists')) || [];
    
    // 저장된 플레이리스트 내용을 콘솔에 출력 (디버깅용)
    console.log('Stored Playlists:', storedPlaylists);
    
    // URL의 ID와 일치하는 플레이리스트를 찾음
    const selectedPlaylist = storedPlaylists.find(pl => pl.id === parseInt(id, 10));
    
    // 선택된 플레이리스트 내용을 콘솔에 출력 (디버깅용)
    console.log('Selected Playlist:', selectedPlaylist);
    
    // 상태에 선택된 플레이리스트를 설정
    setPlaylist(selectedPlaylist);
  }, [id]);

  // 플레이리스트가 없을 때의 처리
  if (!playlist) {
    return <p>플레이리스트를 찾을 수 없습니다.</p>;
  }

  // 재생 버튼 클릭 핸들러
  const handlePlay = (track) => {
    console.log('Playing track:', track);
    const uri = track.spotifyUrl; // 선택된 곡의 URI
    navigate(`/player?uri=${encodeURIComponent(uri)}&token=${encodeURIComponent(accessToken)}&name=${encodeURIComponent(track.name)}&artist=${encodeURIComponent(track.artist)}&albumImage=${encodeURIComponent(track.albumImage)}`);
  };

  // 곡 삭제 핸들러
  const handleDeleteTrack = (trackId) => {
    const updatedTracks = playlist.tracks.filter(track => track.id !== trackId);
    const updatedPlaylist = { ...playlist, tracks: updatedTracks };
    
    // 로컬 스토리지 업데이트
    const storedPlaylists = JSON.parse(localStorage.getItem('userPlaylists')) || [];
    const updatedPlaylists = storedPlaylists.map(pl => (pl.id === playlist.id ? updatedPlaylist : pl));
    localStorage.setItem('userPlaylists', JSON.stringify(updatedPlaylists));

    setPlaylist(updatedPlaylist); // 상태 업데이트
  };

  // 뒤로 가기 버튼 클릭 시 플레이리스트 목록으로 돌아가는 함수
  const goBack = () => {
    navigate('/playlists');
  };

  return (
    <div className="PlaylistDetail">
      <Navbar />
      <button className="back-button" onClick={goBack}>뒤로 가기</button>
      <h2 className='playlist-title'>{playlist.name}</h2>
      <div className="track-list-container">
        {playlist.tracks.length === 0 ? (
          <p>플레이리스트에 노래가 없습니다.</p>
        ) : (
          playlist.tracks.map(track => (
            <div key={track.id} className="track-item">
              <img className="track-image" src={track.albumImage} alt={track.name} />
              <div className="track-info">
                <h3>{track.name}</h3>
                <p>{track.artist}</p>
              </div>
              <button 
                className='play-button'
                onClick={() => handlePlay(track)}
              >
                ▶️
              </button>
              <button 
                className='delete-button' 
                onClick={() => handleDeleteTrack(track.id)}
              >
                🗑 삭제
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PlaylistDetail;
