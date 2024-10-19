import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './UserPlaylists.css';
import Navbar from '../Navbar/Navbar';

function UserPlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  // Access token 가져오기
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setAccessToken(token);
    } else {
      console.error('Access token is missing');
    }
  }, []);

  // 백엔드에서 플레이리스트 가져오기
  useEffect(() => {
    if (!userProfile || !userProfile.id) return;

    fetch(`http://localhost:5000/api/playlists/user-playlists?userId=${userProfile.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => setPlaylists(data.playlists))
      .catch((error) => console.error('Error fetching playlists:', error));
  }, [userProfile]);

  // 플레이리스트 상세보기 함수
  const selectPlaylist = (id) => {
    const fetchPlaylist = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/playlists/user-playlists?userId=${userProfile.id}`, {
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
        const selected = data.playlists.find(p => p._id === id); // 특정 플레이리스트 찾기
        if (!selected) {
          console.error('플레이리스트를 찾을 수 없습니다:', id);
          throw new Error('플레이리스트를 찾을 수 없습니다.');
        }
        setSelectedPlaylist(selected); // 상태로 선택된 플레이리스트 설정
      } catch (error) {
        console.error('Error fetching playlist:', error);
      }
    };

    fetchPlaylist();
  };

  // 새로운 플레이리스트 생성 함수
  const createNewPlaylist = () => {
    if (newPlaylistName.trim() === '') return;

    fetch('http://localhost:5000/api/playlists/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newPlaylistName,
        userId: userProfile.id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const newPlaylist = data.newPlaylist;
        setPlaylists([...playlists, newPlaylist]);
        setNewPlaylistName(''); // 입력 필드 초기화
      })
      .catch((error) => console.error('플레이리스트 생성 중 오류 발생:', error));
  };

  // 플레이리스트 내 곡 삭제 핸들러
  const handleDeleteTrack = async (trackId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/playlists/${selectedPlaylist._id}/tracks/${trackId}`, {
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
      const updatedTracks = selectedPlaylist.tracks.filter(track => track._id !== trackId);

      // 상태 업데이트
      setSelectedPlaylist(prevPlaylist => ({
        ...prevPlaylist,
        tracks: updatedTracks,
      }));
    } catch (error) {
      console.error('곡 삭제 실패:', error);
    }
  };

  // 재생 버튼 클릭 핸들러
  const handlePlay = (track) => {
    const uri = track.spotifyUri; // 선택된 곡의 URI
    navigate(`/player?uri=${encodeURIComponent(uri)}&token=${encodeURIComponent(accessToken)}&name=${encodeURIComponent(track.name)}&artist=${encodeURIComponent(track.artist)}&albumImage=${encodeURIComponent(track.albumImage)}`);
  };

  return (
    <div className="UserPlaylists">
      <Navbar />
      <div className="content-wrapper">
        <div className="playlist-left-container">
          <h3 className='page-title'>My playlist</h3>
          <div>
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="새 플레이리스트 이름"
              className="new-playlist-input"
            />
            <button onClick={createNewPlaylist} className="create-playlist-button">플레이리스트 만들기</button>
          </div>
          <div className="playlist-container">
            {playlists.length === 0 ? (
              <p>아직 플레이리스트가 없습니다.</p>
            ) : (
              playlists.map(playlist => (
                <div
                  key={playlist._id}
                  className="playlist-card"
                  onClick={() => selectPlaylist(playlist._id)}
                >
                  <div className="playlist-info">
                    <h3 className="playlist-name">{playlist.name}</h3>
                    <p className="playlist-track-count">{playlist.tracks.length} 곡</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className='playlist-right-container'>
          {selectedPlaylist ? (
            selectedPlaylist.tracks && selectedPlaylist.tracks.length === 0 ? (
              <p>플레이리스트에 노래가 없습니다.</p>
            ) : (
              selectedPlaylist.tracks && selectedPlaylist.tracks.map(track => (
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
            )
          ) : (
            <p>플레이리스트를 선택하세요.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserPlaylists;
