const express = require('express');
const router = express.Router();
const axios = require('axios');
const querystring = require('querystring');
const User = require('../models/User');

// 스포티파이 인증 라우트
router.get('/auth', (req, res) => {
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/callback';
  const scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state streaming';

  const authUrl = `https://accounts.spotify.com/authorize?${querystring.stringify({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope,
    redirect_uri: redirectUri,
  })}`;

  console.log(authUrl); 
  res.redirect(authUrl);
});

// 스포티파이 콜백 처리 라우트
router.post('/callback', async (req, res) => {
  const { code } = req.body; // POST 방식에서는 req.body를 사용합니다.

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

    // 사용자 정보 요청
    const userResponse = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const { id, display_name, email } = userResponse.data;

    // 사용자 정보 MongoDB에 저장 또는 업데이트
    await User.findOneAndUpdate(
      { spotifyId: id },
      { 
        displayName: display_name,
        email,
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresIn: response.data.expires_in,
        lastLogin: new Date(),
      },
      { upsert: true, new: true }
    );

    // 클라이언트로 응답
    res.json({ access_token, refresh_token });
  } catch (error) {
    console.error('스포티파이 인증 오류:', error.response?.data || error.message);
    res.status(500).json({ error: '스포티파이 인증 실패' });
  }
});

// 엑세스 토큰 갱신 라우트
router.post('/refresh-token', async (req, res) => {
  const { userId } = req.body; // 요청에서 사용자 ID를 받습니다

  try {
    // 사용자의 리프레시 토큰을 MongoDB에서 찾습니다
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const refreshToken = user.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token not available' });
    }

    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    };

    // 새로운 엑세스 토큰 요청
    const response = await axios.post(authOptions.url, authOptions.data, { headers: authOptions.headers });

    const { access_token, expires_in } = response.data;

    // 사용자 데이터베이스에 새로운 엑세스 토큰과 만료 시간 저장
    user.accessToken = access_token;
    user.expiresIn = expires_in;
    await user.save();

    res.json({ access_token, expires_in });
  } catch (error) {
    console.error('Error refreshing token:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

//로그아웃 처리 라우트
router.get('/logout', (req, res) => {
  res.redirect('https://accounts.spotify.com/logout');
});

module.exports = router;
