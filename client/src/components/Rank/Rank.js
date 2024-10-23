import React, { useState, useEffect } from 'react';
import './Rank.css';

// Hot Hits Korea Playlist ID (정확한 ID인지 확인 필요)
const HOT_HITS_KOREA_PLAYLIST_ID = '37i9dQZF1DWT9uTRZAYj0c';

// Access Token 가져오기
async function fetchSpotifyToken() {
  try {
    const response = await fetch('http://localhost:5000/api/token'); // 서버에서 토큰을 가져오는 API
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error fetching token:', error.message);
    return null; // 오류 발생 시 null 반환
  }
}

// 실시간 차트 데이터를 가져오는 함수
async function fetchTopTracksFromPlaylist(playlistId, token) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.items) {
      console.error('Error: data.items is undefined', data);
      return []; // data.items가 없는 경우 빈 배열 반환
    }

    // 상위 15곡만 선택
    return data.items.slice(0, 15).map(item => ({
      id: item.track.id,
      name: item.track.name,
      artist: item.track.artists.map(artist => artist.name).join(', '),
      albumCover: item.track.album.images[0].url, // 앨범 이미지 URL
    }));
  } catch (error) {
    console.error('Error fetching playlist tracks:', error.message);
    return []; // 오류 발생 시 빈 배열 반환
  }
}

// 배열을 5개씩 나누는 함수
function chunkArray(array, size) {
  const chunkedArr = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArr.push(array.slice(i, i + size));
  }
  return chunkedArr;
}

function Rank() {
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTopTracks = async () => {
      const token = await fetchSpotifyToken();
      if (!token) return;

      const tracks = await fetchTopTracksFromPlaylist(HOT_HITS_KOREA_PLAYLIST_ID, token);
      setTopTracks(tracks);
      setLoading(false);
    };

    getTopTracks();
  }, []);

  // Top tracks를 5개씩 나누기
  const trackChunks = chunkArray(topTracks, 5);


  return (
    <section className="section4" id="rank-section">
      <div className='third-container'>
        <h2 className='third-container-title'>실시간 TOP 랭킹</h2>
        <div className='chart-container'>
          {loading ? (
            <div className="loading-spinner">로딩 중...</div>
          ) : (
            trackChunks.map((chunk, chunkIndex) => (
              <div key={chunkIndex} className='chartline'>
                {chunk.map((track, index) => (
                  <div key={index} className='chart-box'>
                    <span className='rank'>{chunkIndex * 5 + index + 1}</span>
                    <img className='album-img' src={track.albumCover} alt={`${track.name} album cover`} />
                    <div className='info'>
                      <h4 className='title'>{track.name}</h4>
                      <span className='artist'>{track.artist}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default Rank;