const http= require('http');
const express = require('express')
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('./passport');
const db = require('./db');
const path = require('path');
const socketio = require('socket.io');


const api = require('./routes/api');
const app = express();
const publicPath = path.resolve(__dirname, '..', 'socket/dist');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(session({
    secret: 'session-secret',
    resave: 'false',
    saveUninitialized: 'true'
  }));

app.use(passport.initialize());
app.use(passport.session());

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
    res.redirect('/u/profile?' + req.user._id);
  }
);

  
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

server.listen(port, function() {
  console.log('Server running on port: ' + port);
});