import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import './Recommendation.css';

function Recommendation() {
  const { state } = useLocation(); // 상태에서 추천 결과 가져오기
  const recommendations = state?.recommendations || [];

  console.log('Recommendations in Recommendation:', recommendations);

  return (
    <div className='Recommendation'>
      <Navbar />
      <h1 className='page-title'>추천 곡</h1>
      <div className='recommendations-list'>
        {recommendations.length > 0 ? (
            recommendations.map((track, index) => (
              <div key={index} className='recommendation-item'>
                <h2 className='recommendation-artist'>{track.artist}</h2>
                <p className='recommendation-track'>곡명: {track.name}</p>
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
