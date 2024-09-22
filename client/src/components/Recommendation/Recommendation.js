import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import './Recommendation.css';
import Player from '../Player/Player';

function Recommendation() {
  const { state } = useLocation(); // 상태에서 추천 결과 가져오기
  const recommendations = state?.recommendations || [];
  const [selectedTrackUri] = useState(''); // 재생할 곡 URI 상태 관리
  const [likes, setLikes] = useState({}); // 좋아요 상태 관리
  const [dislikes, setDislikes] = useState({}); // 싫어요 상태 관리
  const navigate = useNavigate();
  //1시간마다 accessToken 리셋되므로 리프레시 해줘야 함
  const accessToken = 'BQCu2phRqC9RHse4JBufSi7RBwfI_qR-vLwTXK0Q-gLFDtwnmpZIqZQGw8-Xp3DeoiM29OnF6H2p3X2cbv6gGe0PqabNHvCVOXGQwSqTB-46p6aattemjTnC4rd_f7dIIs89aDMphhOWw3cPLUbCPc4pQVbfFYaQa_ceXaTQ0H1UsxY-6Lb2VvIHkXQuEcnpQDrBUQwbZLYD5iaU-ET_RWh3kjGkgbWQq0_KFX34';
  console.log(accessToken);
  console.log(recommendations); // 추천 트랙 배열 출력


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
    console.log('Playing track:', track);
    const uri = track.spotifyUrl; // 선택된 곡의 URI
    navigate(`/player?uri=${encodeURIComponent(uri)}&token=${encodeURIComponent(accessToken)}&name=${encodeURIComponent(track.name)}&artist=${encodeURIComponent(track.artist)}&albumImage=${encodeURIComponent(track.albumImage)}`);
  };  

  // 추천 완료 버튼 클릭 핸들러
  const handleFinish = () => {
    navigate('/'); // 메인 페이지로 이동
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
      <div className='recommendation-button-container'>
        <button className='recommendation-finished' onClick={handleFinish}>추천 완료</button>
      </div>
      {/* Player 컴포넌트를 렌더링하여 선택된 곡 재생 */}
      {selectedTrackUri && <Player token={accessToken} trackUri={selectedTrackUri} />}
    </div>
  );
}

export default Recommendation;
