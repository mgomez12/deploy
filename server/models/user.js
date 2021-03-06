// import node modules
const mongoose = require('mongoose');

// define a schema
const UserModelSchema = new mongoose.Schema ({
 name                : String,
 _id                 : String,
 image               : String,
 descrip             : String,
 friends             : Number,
 notifications       : Array,
 fav_song_rn         : String,
 spotify_followers   : Number,
 unread_notifications: Boolean,
 access_token        : String,
 expire_time         : Number,
 refresh_token       : String,
 top_songs           : Object,
 top_artists         : Object,
 suggestions_received: Array,
 premium             : Boolean,
 recently_played_tracks: Array,
 recently_played_artists: Array,
 related_artists     : Array,
 recent_genres        : Array,
 suggestion_playlist_id: String,
});

// compile model from schema
module.exports = mongoose.model('UserModel', UserModelSchema);

