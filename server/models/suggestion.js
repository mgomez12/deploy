// import node modules
const mongoose = require('mongoose');

// define a schema
const SuggestionModelSchema = new mongoose.Schema ({
  receiver_id: String,
  sender_id: String,
  track_id: String,
  time_sent: Date
});

// compile model from schema
module.exports = mongoose.model('SuggestionModel', SuggestionModelSchema);
