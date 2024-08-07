//사용자 관련 라우트 핸들러를 정의하는 파일
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

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

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새로운 사용자 생성 및 저장
    const newUser = new User({ email, password: hashedPassword, username });
    await newUser.save();
    console.log('새 사용자 저장:', { email, username });

    res.status(201).json({ message: '회원가입 성공' });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({ message: '서버 오류', error: error.message }); // 에러 메시지를 명확히
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