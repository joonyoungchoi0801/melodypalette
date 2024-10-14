import React, { useState, useEffect } from 'react';
import './LikedSongs.css';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../Navbar/Navbar';

const LikedSongs = () => {
  const { userProfile } = useAuth(); // 사용자 프로필 불러오기
  const userId = userProfile?.id; // 사용자 ID
  const [likedTracks, setLikedTracks] = useState([]); // 좋아요한 트랙들 상태 관리
  const [loading, setLoading] = useState(true); // 로딩 상태 관리

  useEffect(() => {
    if (userId) {
      // 사용자 ID를 기반으로 좋아요한 트랙 가져오기
      fetch(`http://localhost:5000/api/likes?userId=${userId}`)
        .then(response => response.json())
        .then(data => {
          console.log(data.likedTracks);
          setLikedTracks(data.likedTracks);
          setLoading(false); // 로딩 완료
        })
        .catch(error => {
          console.error('좋아요한 곡을 불러오는데 실패했습니다:', error);
          setLoading(false);
        });
    }
  }, [userId]);

  if (loading) {
    return <p>로딩 중...</p>;
  }

  return (
    <div className="liked-songs">
      <Navbar />
      <h2>좋아요한 노래</h2>
      {likedTracks.length > 0 ? (
        <ul className="liked-songs-list">
          {likedTracks.map((track, index) => (
            <li key={track.id || index} className="liked-song-item">
              <img src={track.album?.images?.[0]?.url || '/images/default_album_image.png'} alt={track.name || 'Unknown Title'} className="liked-song-image" />
              <div className="liked-song-info">
                <h3>{track.name || 'Unknown Title'}</h3>
                <p>{track.artists?.[0]?.name || 'Unknown Artist'}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>좋아요한 곡이 없습니다.</p>
      )}
    </div>
  );
};

export default LikedSongs;
