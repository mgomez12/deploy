const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const User = require('./models/user')

passport.use(
   new SpotifyStrategy(
     {
       clientID: process.env.clientID,
       clientSecret: process.env.clientSecret,
       callbackURL: '/auth/spotify/callback'
     },
     function(accessToken, refreshToken, expires_in, profile, done) {
       User.findOne({
         '_id': profile.id
       }, function(err, user) {
         if (err) return done(err);
    
         if (!user) {
           const user = new User({
             name: profile.displayName,
             _id: profile.id,
             image: (profile.photos.length >0 ? profile.photos[0] : ''),
             descrip: '',
             fav_song_rn: "",
             spotify_followers: 0,
             friends: [],
             access_token: accessToken,
             refresh_token: refreshToken,
             top_songs: {},
             top_artists: {},
             suggestions_made: [],
             suggestions_received: [],
             recently_played_tracks: [],
             recently_played_artists: [],
             related_artists: [],
             recent_genres: []
           });
    
           user.save(function(err) {
             if (err) console.log(err);
    
             return done(err, user);
           });
         } else {
           user.name = profile.displayName,
           user.image = (profile.photos.length >0 ? profile.photos[0] : '')
           user.access_token = accessToken;
           user.refresh_token = refreshToken;
           user.save();
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
 
