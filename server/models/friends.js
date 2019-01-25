// import node modules
const mongoose = require('mongoose');

// define a schema
const FriendModelSchema = new mongoose.Schema ({
  _id                   : String,
  friends               : Array,
  friends_you_request   : Array,
  friends_need_request  : Array,
  mutual_friends        : Array
});

// compile model from schema
module.exports = mongoose.model('FriendModel', FriendModelSchema);
