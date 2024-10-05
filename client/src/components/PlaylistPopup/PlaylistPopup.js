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
              key={playlist.id} 
              className='playlist-option'
              onClick={() => {
                onSelect(playlist.id);
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
