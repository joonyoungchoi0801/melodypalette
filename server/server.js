const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

const userRoutes = require('./routes/users');
const spotifyAuthRoutes = require('./routes/spotify-auth');
const playlistRoutes = require('./routes/playlists');

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 5000;

// 데이터베이스 연결
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use('/api/users', userRoutes);
app.use('/api/spotify', spotifyAuthRoutes);
app.use('/api/playlists', playlistRoutes);

// 토큰을 가져오기 위한 라우트
app.get('/api/token', async (req, res) => {
  const client_id = process.env.SPOTIFY_CLIENT_ID;  // 올바른 환경 변수 사용
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;  // 올바른 환경 변수 사용

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',  // Content-Type 명시
    },
    form: 'grant_type=client_credentials',  // form 데이터를 문자열로 변환
  };

  try {
    const response = await axios.post(authOptions.url, authOptions.form, {
      headers: authOptions.headers,
    });

    if (response.data && response.data.access_token) {
      console.log('Token fetched:', response.data);
      res.json(response.data); // JSON 응답
    } else {
      res.status(500).json({ error: 'Invalid token response' });
    }
  } catch (error) {
    console.error('Error fetching token:', error.message);
    res.status(500).json({ error: 'Failed to fetch token' });
  }
});


app.get('/api/top-artists', async (req, res) => {
  const { token } = req.query;

  try {
    // 한국(KR)에서 인기 있는 트랙을 포함한 플레이리스트 가져오기
    const response = await axios.get('https://api.spotify.com/v1/browse/categories/toplists/playlists', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        country: 'KR',
      },
    });

    const playlistId = response.data.playlists.items[0].id; // 첫 번째 플레이리스트 ID 가져오기

    // 플레이리스트에서 트랙을 가져옵니다.
    const tracksResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 트랙의 아티스트 정보 가져오기
    const artistIds = new Set();
    tracksResponse.data.items.forEach(item => {
      const artists = item.track.artists;
      artists.forEach(artist => {
        artistIds.add(artist.id);
      });
    });

    // 아티스트 정보를 가져옵니다.
    const artistPromises = Array.from(artistIds).map(artistId =>
      axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    );
    const artistsResponses = await Promise.all(artistPromises);

    const artists = artistsResponses.map(response => ({
      id: response.data.id,
      name: response.data.name,
      imageUrl: response.data.images[0]?.url || '', // 아티스트 이미지가 없는 경우 빈 문자열
    }));

    console.log('Fetched artists:', artists);
    res.json(artists);
  } catch (error) {
    console.error('Error fetching top artists:', error);
    res.status(500).json({ error: 'Failed to fetch top artists' });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
