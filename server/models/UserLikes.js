const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 사용자 좋아요 목록을 저장할 스키마 정의
const userLikesSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  trackId: {
    type: String, // Spotify 트랙 ID (URI가 될 수도 있음)
    required: true,
  },
}, { timestamps: true }); // 생성 및 업데이트 시간을 자동으로 기록

// userId와 trackId에 대해 고유 인덱스 추가
userLikesSchema.index({ userId: 1, trackId: 1 }, { unique: true });

// 스키마를 기반으로 모델 생성
const UserLikes = mongoose.model('UserLikes', userLikesSchema);

module.exports = UserLikes;
