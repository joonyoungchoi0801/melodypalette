import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Player.css';
import Navbar from '../Navbar/Navbar';

function Player() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const trackUri = queryParams.get('uri');
  const trackName = queryParams.get('name');
  const trackArtist = queryParams.get('artist');
  const trackAlbumImage = queryParams.get('albumImage');
  const [player, setPlayer] = useState(null);
  const [isPaused, setIsPaused] = useState(true); // 재생/일시정지 상태 관리
  const [isPlayerReady, setIsPlayerReady] = useState(false); // 플레이어 준비 여부 상태

  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const newPlayer = new window.Spotify.Player({
        name: 'My Spotify Player',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5,
      });

      newPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);

        if (trackUri) {
          fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
            method: 'PUT',
            body: JSON.stringify({ uris: [trackUri] }),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }).then(response => {
            if (response.ok) {
              console.log('Track started playing');
            } else {
              console.error('Failed to start track playback', response);
            }
          });
        }

        setIsPlayerReady(true); // 플레이어 준비 상태 설정
      });

      newPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
        setIsPlayerReady(false);
      });

      newPlayer.addListener('player_state_changed', (state) => {
        setIsPaused(state?.paused);
      });

      newPlayer.connect().then(success => {
        if (success) {
          setPlayer(newPlayer);
          console.log('Player connected successfully');
        } else {
          console.log('Player connection failed');
        }
      });
    };

    if (!window.Spotify) {
      const script = document.createElement('script');
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [token, trackUri, player]);

  // 재생/일시정지 토글 함수
  const togglePlayback = () => {
    if (isPlayerReady && player?.togglePlay) {
      player.togglePlay().then(() => {
        setIsPaused(!isPaused);
      }).catch(error => {
        console.error('Error toggling playback:', error);
      });
    } else {
      console.error('Player is not ready or togglePlay is not available');
    }
  };

  // 뒤로 버튼 클릭 시 호출
  const handleBack = () => {
    window.history.back();  // 이전 페이지로 이동
  };

  return (
    <div className='Player'>
      <Navbar />
      <button onClick={handleBack} className="x-button">⇦</button>
      <div className="player-container">
        {trackUri ? (
          <div>
            <img src={trackAlbumImage} alt={trackName} />
            <div className="player-track-info">
              <h3>{trackName}</h3>
              <p>{trackArtist}</p>
            </div>
          </div>
        ) : (
          <p>No track info available</p>
        )}
        <div className="player-controls">
          <button 
            onClick={togglePlayback}
            disabled={!isPlayerReady} // 플레이어가 준비되지 않으면 버튼 비활성화
          >
            {isPaused ? '▶️' : '⏸️'}
          </button>
        </div>
      </div>
    </div>
    
  );
}

export default Player;
