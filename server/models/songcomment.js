// import node modules
const mongoose = require('mongoose');

// define a schema
const SongModelSchema = new mongoose.Schema ({
  id                    : String,
  comments              : Array,
  love                  : Boolean
});

// compile model from schema
module.exports = mongoose.model('SongModel', SongModelSchema);
