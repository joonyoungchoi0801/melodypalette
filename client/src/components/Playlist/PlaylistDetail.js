import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './PlaylistDetail.css';
import Navbar from '../Navbar/Navbar';

function PlaylistDetail() {
  const { userProfile } = useAuth(); // 사용자 프로필 불러오기
  const userId = userProfile?.id; // 사용자 아이디 추출
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
    // API를 사용하여 플레이리스트 가져오기
    const fetchPlaylist = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/playlists/user-playlists?userId=${userId}`, { 
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('플레이리스트를 가져오는 데 실패했습니다.');
        }

        const data = await response.json();
        const selectedPlaylist = data.playlists.find(p => p._id === id); // 특정 플레이리스트 찾기
        if (!selectedPlaylist) {
          throw new Error('플레이리스트를 찾을 수 없습니다.');
        }
        
        setPlaylist(selectedPlaylist); // 상태에 선택된 플레이리스트를 설정
      } catch (error) {
        console.error('Error fetching playlist:', error);
      }
    };

    fetchPlaylist();
  }, [id, accessToken, userId]);

  // 플레이리스트가 없을 때의 처리
  if (!playlist) {
    return <p>플레이리스트를 찾을 수 없습니다.</p>;
  }

  // 재생 버튼 클릭 핸들러
  const handlePlay = (track) => {
    const uri = track.spotifyUri; // 선택된 곡의 URI
    navigate(`/player?uri=${encodeURIComponent(uri)}&token=${encodeURIComponent(accessToken)}&name=${encodeURIComponent(track.name)}&artist=${encodeURIComponent(track.artist)}&albumImage=${encodeURIComponent(track.albumImage)}`);
  };

  // 곡 삭제 핸들러
  const handleDeleteTrack = async (trackId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/playlists/${playlist._id}/tracks/${trackId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('곡 삭제 실패: ' + response.statusText); 
      }
  
      // 삭제된 트랙을 제외한 새로운 트랙 목록 생성
      const updatedTracks = playlist.tracks.filter(track => track._id !== trackId);
      
      // 상태 업데이트
      setPlaylist(prevPlaylist => ({
        ...prevPlaylist,
        tracks: updatedTracks,
      }));
    } catch (error) {
      console.error('곡 삭제 실패:', error);
    }
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
        {playlist.tracks && playlist.tracks.length === 0 ? ( // tracks가 존재하는지 확인
          <p>플레이리스트에 노래가 없습니다.</p>
        ) : (
          playlist.tracks && playlist.tracks.map(track => ( // tracks가 존재할 때만 map 실행
            <div key={`${track.spotifyUri}-${track.name}`} className="track-item">
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
                onClick={() => handleDeleteTrack(track._id)} 
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
