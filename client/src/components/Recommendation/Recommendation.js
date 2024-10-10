import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import './Recommendation.css';
import Player from '../Player/Player';
import PlaylistPopup from '../PlaylistPopup/PlaylistPopup'; 
import { useAuth } from '../../contexts/AuthContext';

function Recommendation() {
  const { userProfile } = useAuth(); // 사용자 프로필 불러오기
  const userId = userProfile?.id; // 사용자 아이디 추출
  const { state } = useLocation(); // 상태에서 추천 결과 가져오기
  const recommendations = state?.recommendations || [];
  const [accessToken, setAccessToken] = useState(''); // 서버에서 받아온 액세스 토큰 상태 관리
  const [selectedTrackUri, setSelectedTrackUri] = useState(''); // 재생할 곡 URI 상태 관리
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false); // 플레이리스트 선택 창 열기/닫기
  const [selectedTrack, setSelectedTrack] = useState(null); // 추가할 트랙 정보
  const [userPlaylists, setUserPlaylists] = useState([]); // 사용자 플레이리스트 상태 
  const [likedTracks, setLikedTracks] = useState([]); // 좋아요 상태 관리
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setAccessToken(token);
    } else {
      console.error('Access token is missing');
    }

    // 사용자 플레이리스트 불러오기
    if (userId) {
      fetch(`http://localhost:5000/api/playlists/user-playlists?userId=${userId}`)
        .then(response => response.json())
        .then(data => setUserPlaylists(data.playlists))
        .catch(error => console.error('플레이리스트를 불러오는데 실패했습니다.', error));

      // 사용자의 좋아요 목록을 불러오기
      fetch(`http://localhost:5000/api/likes?userId=${userId}`)
        .then(response => response.json())
        .then(data => {
          setLikedTracks(data.likedTracks.map(trackId => ({ id: trackId }))); // 좋아요 목록 상태 관리
        })
        .catch(error => console.error('좋아요 목록을 불러오는데 실패했습니다.', error));
    }
  }, [userId]);

  // 좋아요 버튼 클릭 핸들러
  const handleLike = (trackId, trackName) => {
    const isLiked = likedTracks.some(track => track.id === trackId);

    if (isLiked) {
      // 이미 좋아요가 되어있는 경우 제거
      setLikedTracks(prev => prev.filter(track => track.id !== trackId));

      // 데이터베이스에서 좋아요 제거 요청
      fetch('http://localhost:5000/api/likes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, trackId }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Like removed successfully') {
          console.log('좋아요가 제거되었습니다.');
        // } else {
        //   console.error(data.error);
        }
      })
      .catch(error => {
        console.error('좋아요 제거 실패:', error);
      });
    } else {
      // 좋아요 추가
      setLikedTracks(prev => [...prev, { id: trackId, name: trackName }]); // 트랙 정보 추가

      // 데이터베이스에 좋아요 추가 요청
      fetch('http://localhost:5000/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, trackId }),
      })
      .then(response => {
        console.log('응답 상태:', response.status); // 응답 상태 코드 확인
        return response.json();
      })
      .then(data => {
        console.log('서버 응답:', data); // 서버 응답 로그
        if (data.message === 'Like added successfully') {
          console.log('좋아요가 추가되었습니다.');
        // } else {
        //   console.error(data.error);
        }
      })
      .catch(error => {
        console.error('좋아요 추가 실패:', error);
      });
    }
  };

  // 재생 버튼 클릭 핸들러
  const handlePlay = (track) => {
    const uri = track.spotifyUrl;
    setSelectedTrackUri(uri);
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

    fetch('http://localhost:5000/api/playlists/add-track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playlistId,
        track: {
          name: selectedTrack.name,
          artist: selectedTrack.artist,
          albumImage: selectedTrack.albumImage,
          spotifyUri: selectedTrack.spotifyUri,
        },
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Track added to playlist successfully') {
        alert('곡이 플레이리스트에 성공적으로 추가되었습니다!');
        // 플레이리스트 상태 업데이트
        return fetch(`http://localhost:5000/api/playlists/user-playlists?userId=${userId}`);
      } else {
        alert(data.error);
      }
    })
    .then(response => response.json())
    .then(data => {
      setUserPlaylists(data.playlists); // 업데이트된 플레이리스트 상태 설정
      setIsPlaylistOpen(false);
    })
    .catch(error => {
      console.error('곡 추가 실패:', error);
    });
  };

  // 추천 완료 버튼 클릭 핸들러
  const handleFinish = () => {
    navigate('/'); // 메인 페이지로 이동
  };

  return (
    <div className='Recommendation'>
      <Navbar />
      <h1 className='page-title'>추천 곡</h1>
      <div className='recommendations-list'>
        {recommendations.length > 0 ? (
          recommendations.map((track) => (
            <div key={track.id} className='recommendation-item'>
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
                  className={`like-button ${likedTracks.some(likedTrack => likedTrack.id === track.id) ? 'liked' : ''}`}                  
                  onClick={() => handleLike(track.id, track.name)} // 트랙 ID와 이름을 전달
                >
                  👍 좋아요
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
