// const express = require('express');
// const axios = require('axios');
// const querystring = require('querystring');
// const router = express.Router();

// const clientId = process.env.SPOTIFY_CLIENT_ID;
// const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
// const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

// // 스포티파이 인증 URL로 리다이렉트
// router.get('/login', (req, res) => {
//   const scope = 'user-read-private user-read-email'; // 필요한 권한
//   const authUrl = `https://accounts.spotify.com/authorize?${querystring.stringify({
//     response_type: 'code',
//     client_id: clientId,
//     scope: scope,
//     redirect_uri: redirectUri,
//   })}`;
//   res.redirect(authUrl);
// });

// // 스포티파이 콜백 처리
// router.get('/callback', async (req, res) => {
//   const code = req.query.code || null;

//   try {
//     const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
//       code: code,
//       redirect_uri: redirectUri,
//       grant_type: 'authorization_code',
//     }), {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
//       },
//     });

//     const { access_token, refresh_token } = response.data;
//     // Access token과 refresh token을 사용하여 스포티파이 API 호출
//     res.json({ access_token, refresh_token });
//   } catch (error) {
//     console.error('Error during Spotify authentication:', error);
//     res.status(500).json({ error: 'Failed to authenticate with Spotify' });
//   }
// });

// module.exports = router;
