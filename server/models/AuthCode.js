//MongoDB 모델에 authorization code 저장
const mongoose = require('mongoose');

const AuthCodeSchema = new mongoose.Schema({
  code: { type: String, required: true },
  used: { type: Boolean, default: false }, // 사용 여부
  createdAt: { type: Date, default: Date.now, expires: 600 }, // 10분 후 만료
});

const AuthCode = mongoose.model('AuthCode', AuthCodeSchema);

module.exports = AuthCode;
