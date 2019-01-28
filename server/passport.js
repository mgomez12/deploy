const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const User = require('./models/user')
const Friends = require('./models/friends')

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
          const now = new Date()
           const user = new User({
             name: profile.displayName, 
             _id: profile.id,
             image: (profile.photos.length >0 ? profile.photos[0] : ''),
             descrip: '',
             fav_song_rn: "",
             notifications: [],
             friends: 0,
             spotify_followers: 0,
             access_token: accessToken,
             expire_time: new Date(now.getSeconds() + expires_in).getTime(),
             refresh_token: refreshToken,
             top_songs: {},
             top_artists: {},
             suggestions_received: [],
             recently_played_tracks: [],
             recently_played_artists: [],
             related_artists: [],
             recent_genres: [],
             suggestion_playlist_id: ""
           });

           const friends = new Friends({
             _id: profile.id,
             friends: [],
             sent_request_to: [],
             received_request_from: [],
           })
           friends.save(function(err) {
            if (err) console.log(err);
           });
    
           user.save(function(err) {
             if (err) console.log(err);
    
             return done(err, user);
           });
         } else {
           user.name = profile.displayName,
           console.log('expires in ' + expires_in)
           user.expire_time = new Date(new Date().getTime() + expires_in * 1000).getTime()
           console.log(new Date())
           console.log(user.expire_time)
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
 
