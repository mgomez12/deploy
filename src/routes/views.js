// dependencies
const express = require('express');
const router = express.Router();

// public endpoints
router.get('/', function(req, res, next) {
  res.sendFile('login.html', { root: 'src/views' });
});

router.get('/song', function(req, res, next) {
  res.sendFile('song.html', { root: 'src/views' });
});

router.get('/album', function(req, res, next) {
  res.sendFile('album.html', { root: 'src/views' });
});

router.get('/index', function(req, res, next) {
  res.sendFile('index.html', { root: 'src/views' });
});

router.get('/u/profile', function(req, res) {
  res.sendFile('profile.html', { root: 'src/views' });
});

module.exports = router;
