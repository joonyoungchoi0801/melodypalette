import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './PlaylistPopup.css'; 

function PlaylistPopup({ onSelect, onClose }) {
  const { userProfile } = useAuth();
  const [playlists, setPlaylists] = useState([]);

  // 사용자의 플레이리스트 불러오기
  useEffect(() => {
    if (userProfile && userProfile.id) {
      fetch(`http://localhost:5000/api/playlists/user-playlists?userId=${userProfile.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setPlaylists(data.playlists); // 받아온 플레이리스트를 상태로 설정
        })
        .catch((error) => {
          console.error('플레이리스트를 불러오는데 실패했습니다.', error);
        });
    }
  }, [userProfile]);

  return (
    <div className="playlist-popup">
      <div className="popup-content">
        <h3 className='playlist-option-title'>플레이리스트 선택</h3>
        {playlists.length > 0 ? (
          playlists.map((playlist) => (
            <button 
              key={playlist._id} 
              className='playlist-option'
              onClick={() => {
                onSelect(playlist._id);
                onClose(); // 선택 후 팝업 닫기
              }}
            >
              {playlist.name}
            </button>
          ))
        ) : (
          <p>플레이리스트가 없습니다.</p>
        )}
        <button className="close-button" onClick={onClose}>X</button>
      </div>
    </div>
  );
}

export default PlaylistPopup;
