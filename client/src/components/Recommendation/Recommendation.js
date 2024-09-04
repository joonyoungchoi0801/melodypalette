import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import './Recommendation.css';

function Recommendation() {
  const { state } = useLocation(); // 상태에서 추천 결과 가져오기
  const recommendations = state?.recommendations || [];

  const [likes, setLikes] = useState({}); // 좋아요 상태 관리
  const [dislikes, setDislikes] = useState({}); // 싫어요 상태 관리

  // 좋아요 버튼 클릭 핸들러
  const handleLike = (trackId) => {
    setLikes(prevLikes => ({
      ...prevLikes,
      [trackId]: !prevLikes[trackId], // 토글 기능
    }));
    // 싫어요가 눌려있을 경우 해제
    if (dislikes[trackId]) {
      setDislikes(prevDislikes => ({
        ...prevDislikes,
        [trackId]: false,
      }));
    }
  };

  // 싫어요 버튼 클릭 핸들러
  const handleDislike = (trackId) => {
    setDislikes(prevDislikes => ({
      ...prevDislikes,
      [trackId]: !prevDislikes[trackId], // 토글 기능
    }));
    // 좋아요가 눌려있을 경우 해제
    if (likes[trackId]) {
      setLikes(prevLikes => ({
        ...prevLikes,
        [trackId]: false,
      }));
    }
  };

  // 재생 버튼 클릭 핸들러
  const handlePlay = (track) => {
    const spotifyUrl = track.spotifyUrl || `https://open.spotify.com/search/${encodeURIComponent(track.name)} ${encodeURIComponent(track.artist)}`;
    console.log('Playing track:', track); // 추가 로깅
    window.open(spotifyUrl, '_blank');
  };
  
  return (
    <div className='Recommendation'>
      <Navbar />
      <h1 className='page-title'>추천 곡</h1>
      <div className='recommendations-list'>
        {recommendations.length > 0 ? (
            recommendations.map((track, index) => (
              <div key={index} className='recommendation-item'>
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
                      className={`like-button ${likes[track.id] ? 'liked' : ''}`}
                      onClick={() => handleLike(track.id)}
                    >
                      👍 좋아요
                    </button>
                    <button 
                      className={`dislike-button ${dislikes[track.id] ? 'disliked' : ''}`}
                      onClick={() => handleDislike(track.id)}
                    >
                      👎 싫어요
                    </button>
                    <button 
                      className='play-button'
                      onClick={() => handlePlay(track)}
                    >
                      ▶️ 재생
                    </button>
                  </div>
                </div>
              </div>
          ))
        ) : (
          <p className='no-recommendations'>추천할 항목이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default Recommendation;
