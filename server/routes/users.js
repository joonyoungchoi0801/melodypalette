//사용자 관련 라우트 핸들러를 정의하는 파일
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 회원가입 라우트
router.post('/signup', async (req, res) => {
  const { email, password, username } = req.body;
  console.log('회원가입 요청:', { email, username });

  try {
    // 이메일 중복 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('중복 이메일:', email);
      return res.status(400).json({ message: '이미 사용중인 이메일입니다.' });
    }

    // 새로운 사용자 생성 및 저장 (해싱하지 않음)
    const newUser = new User({ email, password, username });
    await newUser.save();
    res.status(201).json({ message: '회원가입 성공' });
  } catch (error) {
    res.status(500).json({ message: '서버 오류', error: error.message });
  }
});

// 로그인 라우트
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('로그인 시도:', email, password);

  try {
    // 사용자 확인
    const user = await User.findOne({ email });
    if (!user) {
      console.log('사용자 없음:', email);
      return res.status(400).json({ message: '잘못된 이메일입니다.' });
    }

    // 비밀번호 확인
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('비밀번호 불일치:', email);
      return res.status(400).json({ message: '잘못된 비밀번호입니다.' });
    }
    res.status(200).json({ message: '로그인 성공', redirectUrl: '/', username: user.username});
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({ message: '서버 오류', error });
  }
});

// 사용자 목록 조회 라우트
router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: '서버 오류', error });
  }
});

module.exports = router;