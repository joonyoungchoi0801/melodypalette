const express = require('express');
const router = express.Router();
const axios = require('axios');
const querystring = require('querystring');

// 스포티파이 인증 라우트
router.get('/auth', (req, res) => {
  const redirectUri = 'http://localhost:3000/callback';
  const scope = 'user-read-private user-read-email';

  const authUrl = `https://accounts.spotify.com/authorize?${querystring.stringify({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope,
    redirect_uri: redirectUri,
  })}`;

  res.redirect(authUrl);
});

// 스포티파이 콜백 처리 라우트
router.get('/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        Authorization: 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: querystring.stringify({
        code,
        redirect_uri: 'http://localhost:3000/callback',
        grant_type: 'authorization_code',
      }),
      method: 'POST',
    };

    const response = await axios(authOptions);
    const { access_token, refresh_token } = response.data;

    // 여기서 메인 페이지로 리디렉션
    res.redirect(`http://localhost:3000?access_token=${access_token}`);
  } catch (error) {
    console.error('스포티파이 인증 오류:', error);
    res.status(500).json({ error: '스포티파이 인증 실패' });
  }
});

router.get('/logout', (req, res) => {
  res.redirect('https://accounts.spotify.com/logout');
});

module.exports = router;
