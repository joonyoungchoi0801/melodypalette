const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Playlist 스키마 정의
const playlistSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true, // 특정 사용자의 플레이리스트를 구분하기 위함
  },
  tracks: [
    {
      name: String,
      artist: String,
      albumImage: String,
      spotifyUri: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Playlist 모델 생성
const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;