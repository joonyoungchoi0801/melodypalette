//사용자 정보를 저장하기 위한 모델을 정의
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  spotifyId: { type: String, unique: true, required: true },
  displayName: String,
  email: String,
  accessToken: String,
  refreshToken: String,
  expiresIn: Number,
});

module.exports = mongoose.model('User', userSchema);
