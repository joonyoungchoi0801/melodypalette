const express = require('express');
const mongoose = require('mongoose');
const Playlist = require('../models/Playlist');
const router = express.Router();

//사용자 플레이리스트 가져오기
router.get('/user-playlists', async (req, res) => {
  const { userId } = req.query; // 사용자 ID를 받아서 해당 사용자의 플레이리스트 조회
  try {
    const playlists = await Playlist.find({ userId });
    res.json({ playlists });
  } catch (error) {
    res.status(500).json({ error: '플레이리스트를 가져오는데 실패했습니다.' });
  }
});

// 새로운 플레이리스트 생성
router.post('/create', async (req, res) => {
  const { name, userId } = req.body;

  try {
    const newPlaylist = new Playlist({ name, userId, tracks: [] });
    await newPlaylist.save();
    res.json({ message: 'Playlist created successfully', newPlaylist });
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ error: 'Failed to create playlist' });
  }
});

// 플레이리스트에 트랙 추가
router.post('/add-track', async (req, res) => {
  const { playlistId, track } = req.body;

  try {
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // 플레이리스트에 새로운 트랙 추가
    playlist.tracks.push({
      _id: new mongoose.Types.ObjectId(),
      name: track.name,
      artist: track.artist,
      albumImage: track.albumImage,
      spotifyUri: track.spotifyUri,
    });
    await playlist.save();

    res.json({ message: 'Track added to playlist successfully', playlist });
  } catch (error) {
    console.error('Error adding track:', error);
    res.status(500).json({ error: 'Failed to add track to playlist' });
  }
});

// 플레이리스트 업데이트 (곡 삭제 포함)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPlaylist = req.body;

    const playlist = await Playlist.findByIdAndUpdate(id, updatedPlaylist, { new: true });
    if (!playlist) {
      return res.status(404).json({ message: '플레이리스트를 찾을 수 없습니다.' });
    }

    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ message: '플레이리스트 업데이트 중 오류 발생.' });
  }
});

// 곡 삭제 라우터
router.delete('/:id/tracks/:trackId', async (req, res) => {
  const { id, trackId } = req.params;

  try {
    const playlist = await Playlist.findById(id);
    if (!playlist) {
      return res.status(404).json({ message: '플레이리스트를 찾을 수 없습니다.' });
    }

    // 곡 삭제
    playlist.tracks = playlist.tracks.filter(track => track._id.toString() !== trackId);
    await playlist.save();

    res.status(200).json({ message: 'Track deleted successfully', playlist });
  } catch (error) {
    console.error('Error deleting track:', error);
    res.status(500).json({ message: '곡 삭제 중 오류 발생.' });
  }
});

// 플레이리스트 삭제
router.delete('/:id', async (req, res) => {
  const { id } = req.params; // URL에서 플레이리스트 ID 추출

  try {
    const playlist = await Playlist.findByIdAndDelete(id); // 플레이리스트 삭제
    if (!playlist) {
      return res.status(404).json({ message: '플레이리스트를 찾을 수 없습니다.' });
    }

    res.status(200).json({ message: '플레이리스트 삭제 완료', playlist });
  } catch (error) {
    console.error('플레이리스트 삭제 중 오류 발생:', error);
    res.status(500).json({ error: '플레이리스트 삭제 실패' });
  }
});

module.exports = router;
