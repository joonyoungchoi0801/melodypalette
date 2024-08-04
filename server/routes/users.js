const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// 회원가입 라우트
router.post('/signup', async (req, res) => {
  const { email, password, username } = req.body;

  try {
    // 이메일 중복 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: '이미 사용중인 이메일입니다.' });
    }

    // 새 사용자 생성
    const newUser = new User({ email, password, username });
    await newUser.save();

    res.status(201).json({ message: '회원가입 성공' });
  } catch (error) {
    res.status(500).json({ message: '서버 오류', error });
  }
});

// 로그인 라우트
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 사용자 확인
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: '잘못된 이메일 또는 비밀번호입니다.' });
    }

    // 비밀번호 확인
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: '잘못된 이메일 또는 비밀번호입니다.' });
    }

    res.status(200).json({ message: '로그인 성공' });
  } catch (error) {
    res.status(500).json({ message: '서버 오류', error });
  }
});

module.exports = router;
