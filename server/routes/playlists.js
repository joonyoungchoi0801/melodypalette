const express = require('express');
const Playlist = require('../models/Playlist');
const router = express.Router();

// 플레이리스트에 트랙 추가
router.post('/add-track', async (req, res) => {
  const { playlistId, track } = req.body;

  try {
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // 플레이리스트에 새로운 트랙 추가
    playlist.tracks.push(track);
    await playlist.save();

    res.json({ message: 'Track added to playlist successfully', playlist });
  } catch (error) {
    console.error('Error adding track:', error);
    res.status(500).json({ error: 'Failed to add track to playlist' });
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

module.exports = router;
