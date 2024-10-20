import React from 'react';
import './PlaylistPopup.css';

function PlaylistPopup({ playlists, onSelect, onClose }) {
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
                onSelect(playlist._id); // 선택 후 플레이리스트에 곡 추가
              }}
            >
              {playlist.name}
            </button>
          ))
        ) : (
          <p>플레이리스트가 없습니다.</p>
        )}
        <button className="playlist-close-button" onClick={onClose}>뒤로가기</button>
      </div>
    </div>
  );
}

export default PlaylistPopup;
