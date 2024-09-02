const fetchArtistTopTracks = async (artistId, token) => {
  try {
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    // 데이터 구조 점검
    if (!data || !data.tracks) {
      console.error('Invalid data structure:', data);
      return [];
    }

    return data.tracks.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map(artist => artist.name).join(', '), // 아티스트 이름을 추출
      spotifyUrl: track.external_urls.spotify, // Spotify URL 추가
    }));
  } catch (error) {
    console.error('Error fetching artist top tracks:', error.message);
    return [];
  }
};


// 트랙의 오디오 특징을 가져오는 함수
const fetchTrackAudioFeatures = async (trackIds, token) => {
  try {
    const response = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIds.join(',')}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    // 데이터 검증
    if (!data || !data.audio_features) {
      console.error('Invalid data structure:', data);
      return [];
    }

    return data.audio_features;
  } catch (error) {
    console.error('Error fetching track audio features:', error.message);
    return [];
  }
};

const calculateArtistFeatureVector = async (artistId, token) => {
  try {
    const topTracks = await fetchArtistTopTracks(artistId, token);
    if (!topTracks.length) {
      console.error('No top tracks found for artist:', artistId);
      return [];
    }

    const trackIds = topTracks.map(track => track.id);
    const audioFeatures = await fetchTrackAudioFeatures(trackIds, token);

    // 데이터 검증
    if (!audioFeatures || !audioFeatures.length) {
      console.error('No audio features found for tracks:', trackIds);
      return [];
    }

    // 오디오 특징 값의 합계를 계산
    const featureSums = audioFeatures.reduce((acc, features) => {
      if (!features) return acc;

      acc.energy += features.energy || 0;
      acc.danceability += features.danceability || 0;
      acc.tempo += features.tempo || 0;
      acc.acousticness += features.acousticness || 0;
      return acc;
    }, { energy: 0, danceability: 0, tempo: 0, acousticness: 0 });

    const numTracks = audioFeatures.length;

    // 평균 값을 계산하여 벡터 생성
    return [
      featureSums.energy / numTracks,
      featureSums.danceability / numTracks,
      featureSums.tempo / numTracks,
      featureSums.acousticness / numTracks
    ];
  } catch (error) {
    console.error('Error calculating artist feature vector:', error.message);
    return [];
  }
};


// 두 벡터 간의 코사인 유사도 계산 함수
const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((acc, curr, index) => acc + curr * vecB[index], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((acc, curr) => acc + curr * curr, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((acc, curr) => acc + curr * curr, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

export const getTrackRecommendationsWithCosineSimilarity = async (selectedArtists, token) => {
  try {
    const selectedArtistsFeatures = await Promise.all(
      selectedArtists.map(artistId => calculateArtistFeatureVector(artistId, token))
    );

    if (selectedArtistsFeatures.some(features => !features.length)) {
      console.error('Some selected artists have no valid feature vectors');
      return [];
    }

    const relatedArtistsMap = new Map();

    for (const artistId of selectedArtists) {
      const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/related-artists`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      for (const artist of data.artists) {
        const artistFeatures = await calculateArtistFeatureVector(artist.id, token);
        
        if (artistFeatures.length) {
          const similarity = Math.max(
            ...selectedArtistsFeatures.map(
              selectedFeatures => cosineSimilarity(selectedFeatures, artistFeatures)
            )
          );

          if (relatedArtistsMap.has(artist.id)) {
            relatedArtistsMap.set(artist.id, Math.max(relatedArtistsMap.get(artist.id), similarity));
          } else {
            relatedArtistsMap.set(artist.id, similarity);
          }
        }
      }
    }

    const sortedRelatedArtists = Array.from(relatedArtistsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(entry => entry[0]);

    const allTracks = await Promise.all(
      sortedRelatedArtists.map(artistId => fetchArtistTopTracks(artistId, token))
    );

    const recommendationTracks = [];
    const maxTracks = 10;
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

// 장르 기반으로 곡 추천 받기
export const getTracksByGenre = async (genres, token) => {
  try {
    const response = await fetch(`https://api.spotify.com/v1/recommendations?seed_genres=${genres.join(',')}&limit=10`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    return data.tracks.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
    }));
  } catch (error) {
    console.error('Error fetching tracks by genre:', error.message);
    return [];
  }
};