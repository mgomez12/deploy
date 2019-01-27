// import node modules
const mongoose = require('mongoose');

// define a schema
const DescriptionModelSchema = new mongoose.Schema ({
    user_id: String,
    bio: String,
    time_sent: Date
});

// compile model from schema
module.exports = mongoose.model('DescriptionModel', DescriptionModelSchema);