const http= require('http');
const express = require('express')
const session = require('express-session');
const bodyParser = require('body-parser');
require('dotenv').config();
const passport = require('./passport');
const db = require('./db')
const path = require('path');
const socketio = require('socket.io');
const request = require('request-promise');
const User = require('./models/user')
const MongoStore = require('connect-mongo')(session);


const api = require('./routes/api');
const app = express();
const publicPath = path.resolve(__dirname, '..', 'client/dist');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var sessionStore = new MongoStore({
  mongooseConnection: db
});

app.use(session({
    secret: 'session-secret',
    resave: 'false',
    store: sessionStore,
    saveUninitialized: 'true'
  }));

app.use(passport.initialize());
app.use(passport.session());

app.get(['/u/profile/:user'], function (req, res) {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

app.get(['/login'], function (req, res) {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

app.get(['/error'], function (req, res) {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

app.get(['/song/:songid'], function (req, res) {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

app.get(['/album/:albumid'], function (req, res) {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

app.get(['/artist/:artistid'], function (req, res) {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

app.get(['/defaultprofileimage'], function (req, res) {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

app.get('/auth/spotify', passport.authenticate('spotify', { scope:['user-read-private', 'user-top-read']}),
 function(req, res) {
  // The request will be redirected to spotify for authentication, so this
  // function will not be called.
});

app.get(
  '/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.

    var top_songs = {
      url: 'https://api.spotify.com/v1/me/top/tracks?limit=50',
      headers: {'Authorization': "Bearer " + req.user.access_token},
      json: true
    };

    var top_artists = {
      url: 'https://api.spotify.com/v1/me/top/artists?limit=50',
      headers: {'Authorization': "Bearer " + req.user.access_token},
      json: true
    };

    var prof = {
      url: 'https://api.spotify.com/v1/users/' + req.user._id,
      headers: {'Authorization': "Bearer " + req.user.access_token},
      json: true
    };
    let values= {
      top_songs: request(top_songs),
      top_artists: request(top_artists),
      profInfo: request(prof)
    }

    
    // request top songs and save to database


    User.findOne({_id: req.user._id}, (err, profile)=> {
      values.top_songs.then(track => {profile.top_songs = track.items}).then(
      values.top_artists.then(artist => {profile.top_artists = artist.items})).then(
      values.profInfo.then(prof => {profile.spotify_followers = prof.followers.total})).then(
      () => profile.save())
    })
    res.redirect('/');
  });

  
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.use('/api', api)
app.use(express.static(publicPath));

app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// route error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    status: err.status,
    message: err.message,
  });
});


// port config
const port = 3000; // config variable
const server = http.Server(app);

const io = socketio(server);
app.set('socketio', io);

server.listen(process.env.PORT || port, function() {
  console.log('Server running on port: ' + port);
});


