// dependencies
const express = require('express');
const connect = require('connect-ensure-login');

// models
const User = require('../models/user');
const Suggestion = require('../models/suggestion')

const router = express.Router();

router.get('/user', function(req, res) {
    User.findOne({ _id: req.query._id }, function(err, user) {
        if(err) {
            console.log(err)
        }
      res.send(user);
    });
  });
  
router.get('/allusers', function(req, res) {
    User.find({}, function(err, users) {
        if(err) {
            console.log("hello")
            console.log(err)
        }
        res.send(users);
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

router.get('/updateUser', function(req, res) {
    if(req.isAuthenticated()) {
        console.log('searching for user')
        User.findOne({ _id: req.user._id}, function(err, user) {
            if(err) {
                console.log(err)
                res.send(err)
            }
            else {
                console.log('logging in updated user')
                req.logOut();
                req.login(user, (err) => {console.log(err)});
                res.send(req.user);
            }
    })
}})

router.get("/suggestion", function(req, res) {
    connect.ensureLoggedIn();
    console.log(req.query.receiver)
    Suggestion.find( {receiver_id: req.query.receiver}, null,
         {sort: {time_sent: -1}, limit: Number(req.query.limit)}, (err, items) => {
             if (err) {
                 res.send(err)
             }
             console.log("sending" + items);
        res.send(items);
    });
    
})

router.post('/suggestion', function(req, res) {
    connect.ensureLoggedIn();
    const newSuggestion = Suggestion({
        sender_id: req.body.sender,
        receiver_id: req.body.receiver,
        track_id: req.body.track,
        time_sent: req.body.time
    })
    User.findOne({_id: req.body.receiver}, (err, receiverProfile) => {
        if (!receiverProfile) {
            res.send({status: 'fail'});
        }
        else {
        receiverProfile.suggestions_received.push(newSuggestion._id)
        receiverProfile.save() 
        User.findOne({_id: req.body.sender}, (err, senderProfile) => {
            senderProfile.suggestions_made.push(newSuggestion._id)
            senderProfile.save()
        });
        newSuggestion.save();
        res.send({status: 'success'});}
    });
})

router.post('/friend', function(req, res) {
    connect.ensureLoggedIn();
    if(req.user.friends.includes(req.body.receiver)) {
        res.send({status: 'fail'});
    }
    else {
        User.findOne({_id: req.body.sender}, (err, profile) => {
            profile.friends.push(req.body.receiver)
            profile.save()
        });
        User.findOne({_id: req.body.receiver}, (err, profile) => {
            profile.friends.push(req.body.sender)
            profile.save()
        });
        res.send({})
    }

})

module.exports = router;