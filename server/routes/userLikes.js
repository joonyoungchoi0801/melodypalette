const express = require('express');
const router = express.Router();
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
    const likedTracks = await UserLikes.find({ userId });
    const trackIds = likedTracks.map(like => like.trackId);
    res.json({ likedTracks: trackIds });
  } catch (error) {
    console.error('Error fetching liked tracks:', error);
    res.status(500).json({ error: 'Failed to fetch liked tracks' });
  }
});

module.exports = router;
