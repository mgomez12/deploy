const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const User = require('./models/user')

passport.use(
    new SpotifyStrategy(
      {
        clientID: 'd3f7342d0ec24baf94ede9f2ead6eaeb',
        clientSecret: '47b3c6d4d21345e3aca87fea698f42b8',
        callbackURL: 'http://localhost:3000/auth/spotify/callback'
      },
      function(accessToken, refreshToken, expires_in, profile, done) {
        User.findOne({
          '_id': profile.id
        }, function(err, user) {
          if (err) return done(err);
      
          if (!user) {
            const user = new User({
              name: profile.displayName,
              _id: profile.id
            });
      
            user.save(function(err) {
              if (err) console.log(err);
      
              return done(err, user);
            });
          } else {
            return done(err, user);
          }
        });
      }));

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

module.exports = passport;
  