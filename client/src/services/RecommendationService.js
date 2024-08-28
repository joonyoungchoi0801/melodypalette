// 특정 아티스트의 상위 트랙을 가져오는 함수
const fetchArtistTopTracks = async (artistId, token) => {
  try {
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return data.tracks.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
    }));
  } catch (error) {
    console.error('Error fetching artist top tracks:', error.message);
    return [];
  }
};

// 선택한 아티스트들의 연관 아티스트 기반 추천을 생성하는 함수
export const getTrackRecommendationsFromRelatedArtists = async (selectedArtists, token) => {
  try {
    const relatedArtistsMap = new Map();

    // 선택한 각 아티스트의 연관 아티스트를 가져옴
    for (const artistId of selectedArtists) {
      const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/related-artists`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      
      // 연관 아티스트들의 유사성을 측정해 Map에 추가 (유사성 점수는 예를 들어 1.0으로 설정)
      data.artists.forEach(artist => {
        if (relatedArtistsMap.has(artist.id)) {
          relatedArtistsMap.set(artist.id, relatedArtistsMap.get(artist.id) + 1);
        } else {
          relatedArtistsMap.set(artist.id, 1);
        }
      });
    }

    // 유사성이 높은 상위 10개의 아티스트를 선택
    const sortedRelatedArtists = Array.from(relatedArtistsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(entry => entry[0]);

    // 상위 10개의 아티스트의 곡을 가져옴
    const allTracks = await Promise.all(
      sortedRelatedArtists.map(artistId => fetchArtistTopTracks(artistId, token))
    );

    // 각 아티스트에서 고르게 곡을 추천하는 방식으로 상위 10곡 추출
    const recommendationTracks = [];
    const maxTracks = 10; // 추천할 최대 곡 수
    let trackIndex = 0;

    while (recommendationTracks.length < maxTracks && trackIndex < Math.max(...allTracks.map(artistTracks => artistTracks.length))) {
      for (const artistTracks of allTracks) {
        if (artistTracks[trackIndex] && recommendationTracks.length < maxTracks) {
          recommendationTracks.push(artistTracks[trackIndex]);
        }
      }
      trackIndex++;
    }

    return recommendationTracks;
  } catch (error) {
    console.error('Error fetching track recommendations:', error.message);
    return [];
  }
};
