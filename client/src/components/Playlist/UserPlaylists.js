import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 변경: useHistory → useNavigate
import './UserPlaylists.css'; 
import Navbar from '../Navbar/Navbar';

function UserPlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const navigate = useNavigate(); // 변경: useHistory() → useNavigate()

  useEffect(() => {
    const storedPlaylists = JSON.parse(localStorage.getItem('userPlaylists')) || [];
    setPlaylists(storedPlaylists);
  }, []);

  const createNewPlaylist = () => {
    if (newPlaylistName.trim() === '') return;

    const newPlaylist = {
      id: Date.now(),
      name: newPlaylistName,
      tracks: [],
      coverImage: '/default-cover.jpg'
    };

    const updatedPlaylists = [...playlists, newPlaylist];
    setPlaylists(updatedPlaylists);
    localStorage.setItem('userPlaylists', JSON.stringify(updatedPlaylists));
    setNewPlaylistName('');
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
              key={playlist.id} 
              className="playlist-card"
              onClick={() => goToPlaylistDetail(playlist.id)}
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
