import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../contexts/AuthContext';
import './UserPlaylists.css'; 
import Navbar from '../Navbar/Navbar';

function UserPlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const navigate = useNavigate(); 
  const { userProfile } = useAuth();

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

  const goToPlaylistDetail = (id) => {
    navigate(`/playlists/${id}`);
  };

  return (
    <div className="UserPlaylists">
      <Navbar />
      <h2 className='page-title'>내 플레이리스트</h2>
      <div className="new-playlist-container">
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
              onClick={() => goToPlaylistDetail(playlist._id)}
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
  );
}

export default UserPlaylists;
