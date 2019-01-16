const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;

passport.use(
    new SpotifyStrategy(
      {
        clientID: 'd3f7342d0ec24baf94ede9f2ead6eaeb',
        clientSecret: '47b3c6d4d21345e3aca87fea698f42b8',
        callbackURL: 'http://localhost:3000/auth/spotify/callback'
      },
      function(accessToken, refreshToken, expires_in, profile, done) {
        return done(err, user)
        User.findOrCreate({ spotifyId: profile.id }, function(err, user) {
          return done(err, user);
        });
      }
    )
  );

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

module.exports = passport;
  