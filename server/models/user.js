// import node modules
const mongoose = require('mongoose');

// define a schema
const UserModelSchema = new mongoose.Schema ({
 name                : String,
 _id                 : String,
 image               : String,
 descrip             : String,
 fav_song_rn         : String,
 spotify_followers   : Number,
 friends             : Array,
 access_token        : String,
 refresh_token       : String,
 top_songs           : Object,
 top_artists         : Object,
 suggestions_made    : Array,
 suggestions_received: Array,
 recently_played_tracks: Array,
 related_artists     : Array,
 recent_genres        : Array
});

// compile model from schema
module.exports = mongoose.model('UserModel', UserModelSchema);

