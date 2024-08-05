const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

// nodemailer 설정
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // SSL을 사용하는 경우 true로 설정
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const verificationCodes = {}; // 메모리 내 저장 (임시)

router.post('/send-email-code', (req, res) => {
  const { email } = req.body;

  // 랜덤 인증번호 생성
  const code = crypto.randomBytes(3).toString('hex');

  // 메모리 내에 저장 (DB를 사용할 경우 DB에 저장)
  verificationCodes[email] = code;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification Code',
    text: `Your verification code is: ${code}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error); // 에러를 콘솔에 출력
      return res.status(500).json({ message: '이메일 전송 실패', error });
    } else {
      console.log('Email sent:', info.response); // 이메일 전송 성공 메시지 출력
      res.status(200).json({ message: '인증 번호가 이메일로 전송되었습니다.' });
    }
  });
});

router.post('/verify-email-code', (req, res) => {
  const { email, code } = req.body;
  
  console.log('Verification attempt:', { email, code, storedCode: verificationCodes[email] });

  if (verificationCodes[email] && verificationCodes[email] === code) {
    delete verificationCodes[email]; // 인증 완료 후 코드 삭제
    res.status(200).json({ message: '인증 성공' });
  } else {
    res.status(400).json({ message: '인증 실패' });
  }
});

module.exports = router;
