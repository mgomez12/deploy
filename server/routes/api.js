// dependencies
const express = require('express');
const connect = require('connect-ensure-login');

// models
const User = require('../models/user');
const Suggestion = require('../models/suggestion')

const router = express.Router();

router.get('/user', function(req, res) {
    User.findOne({ _id: req.query._id }, function(err, user) {
        console.log(user);
      res.send(user);
    });
  });
  

router.get('/whoami', function(req, res) {

if(req.isAuthenticated()){
    res.send(req.user);
}
else{
    res.send({});
}
});

router.post('/submitSuggestion', function(req, res) {
    connect.ensureLoggedIn();
    const newSuggestion = Suggestion({
        sender_id: req.body.sender,
        receiver_id: req.body.receiver,
        track_id: req.body.track,
        time_sent: req.body.time
    })
    newSuggestion.save();
    User.findOne({_id: req.body.sender}, (err, profile) => {
        profile.suggestions_made.push(newSuggestion._id)
        profile.save()
    });
    User.findOne({_id: req.body.receiver}, (err, profile) => {
        profile.suggestions_received.push(newSuggestion._id)
        profile.save()
    });
    res.send({})
})

module.exports = router;