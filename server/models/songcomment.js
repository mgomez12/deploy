// import node modules
const mongoose = require('mongoose');

// define a schema
// comment array is full of comment objects of who posted, content, and amount of loves defined by userId, content, and loves
const SongModelSchema = new mongoose.Schema ({
  id                    : String,
  comments              : Array,
});

// compile model from schema
module.exports = mongoose.model('SongModel', SongModelSchema);
