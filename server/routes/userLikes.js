const express = require('express');
const axios = require('axios');
const router = express.Router();
const User = require('../models/User');
const UserLikes = require('../models/UserLikes'); // UserLikes 모델 불러오기

// 좋아요 추가
router.post('/', async (req, res) => {
  const { userId, trackId } = req.body;

  try {
    // 중복 확인
    const existingLike = await UserLikes.findOne({ userId, trackId });

    if (existingLike) {
      return res.status(400).json({ message: '이미 좋아요를 눌렀습니다.' });
    }

    // 좋아요 추가
    const newLike = new UserLikes({ userId, trackId });
    await newLike.save();

    res.status(201).json({ message: '좋아요가 추가되었습니다.' });
  } catch (error) {
    if (error.code === 11000) {
      // 중복 키 오류 처리
      res.status(400).json({ message: '이미 좋아요를 눌렀습니다.' });
    } else {
      console.error('Error adding like:', error);
      res.status(500).json({ error: 'Failed to add like' });
    }
  }
});

// 좋아요 제거
router.delete('/', async (req, res) => {
  const { userId, trackId } = req.body;

  const deletedLike = await UserLikes.findOneAndDelete({ userId, trackId });
  if (!deletedLike) {
    return res.status(400).json({ message: '좋아요가 존재하지 않습니다.' });
  }

  return res.status(200).json({ message: '좋아요가 제거되었습니다.' });
});

// 사용자 좋아요 목록 가져오기
router.get('/', async (req, res) => {
  const { userId } = req.query;

  try {
    // DB에서 사용자 정보를 가져오기 (accessToken 포함)
    const user = await User.findOne({ spotifyId: userId });
    if (!user || !user.accessToken) {
      return res.status(404).json({ error: 'User not found or access token missing' });
    }

     // accessToken을 가져와서 Spotify API 호출에 사용
     const accessToken = user.accessToken;
     // 좋아요한 트랙 정보 가져오기
    const likedTracks = await UserLikes.find({ userId });
    const trackIds = likedTracks.map(like => like.trackId);

    // Spotify API로 트랙 정보 가져오기
    const trackDetailsPromises = trackIds.map(trackId =>
      axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // DB에서 가져온 accessToken 사용
        },
      })
    );

    const trackDetails = await Promise.all(trackDetailsPromises);
    const detailedTracks = trackDetails.map(response => response.data);

    res.json({ likedTracks: detailedTracks });
  } catch (error) {
    console.error('좋아요한 트랙 목록 불러오기 오류:', error);
    res.status(500).json({ error: 'Failed to fetch liked tracks' });
  }
});

module.exports = router;
