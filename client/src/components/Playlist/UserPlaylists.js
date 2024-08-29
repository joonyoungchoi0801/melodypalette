import React, { useState, useEffect } from 'react';
import './UserPlaylists.css'; // 필요한 경우 스타일링을 위한 CSS 파일
import Navbar from '../Navbar/Navbar';

function UserPlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  // 저장된 플레이리스트를 가져오는 함수
  useEffect(() => {
    const storedPlaylists = JSON.parse(localStorage.getItem('userPlaylists')) || [];
    setPlaylists(storedPlaylists);
  }, []);

  // 새 플레이리스트를 만드는 함수
  const createNewPlaylist = () => {
    if (newPlaylistName.trim() === '') return; // 이름이 비어있으면 생성을 중단

    const newPlaylist = {
      id: Date.now(), // 고유 ID 생성
      name: newPlaylistName,
      tracks: [],
      coverImage: '/default-cover.jpg' // 기본 커버 이미지 설정
    };

    const updatedPlaylists = [...playlists, newPlaylist];
    setPlaylists(updatedPlaylists);
    localStorage.setItem('userPlaylists', JSON.stringify(updatedPlaylists)); // 로컬 스토리지에 저장
    setNewPlaylistName(''); // 입력 필드 초기화
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
              key={playlist.id} 
              className="playlist-card"
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
