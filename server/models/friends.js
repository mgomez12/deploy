// import node modules
const mongoose = require('mongoose');

// define a schema
const FriendModelSchema = new mongoose.Schema ({
  _id                   : String,
  friends               : Array,
  sent_request_to       : Array,
  received_request_from : Array,
  mutual_friends        : Array
});

// compile model from schema
module.exports = mongoose.model('FriendModel', FriendModelSchema);
