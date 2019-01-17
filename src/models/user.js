// import node modules
const mongoose = require('mongoose');

// define a schema
const UserModelSchema = new mongoose.Schema ({
  name        	: String,
  spotifyid     : String,
  top_artist   	: String,
});

// compile model from schema
module.exports = mongoose.model('UserModel', UserModelSchema);
