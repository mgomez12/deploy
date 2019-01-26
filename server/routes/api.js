// dependencies
const express = require('express');
const connect = require('connect-ensure-login');

// models
const User = require('../models/user');
const Suggestion = require('../models/suggestion');
const Friend = require('../models/friends');
const SongComment = require('../models/songcomment');

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

            if (req.body.sender !== 'anonymous') {
                User.findOne({_id: req.body.sender}, (err, senderProfile) => {
                    senderProfile.suggestions_made.push(newSuggestion._id)
                    senderProfile.save()
                    });
            }

        newSuggestion.save();
        res.send({status: 'success'});}
    });
})

router.post('/friend', function(req, res) {
    connect.ensureLoggedIn();
    Friend.findOne({_id: req.body.sender}, (err, friendObj) => {
        if (err) {
            console.log(err);
        }
        else {
            if (friendObj.received_request_from.includes(req.body.receiver)) {
                friendObj.friends.push(req.body.receiver)
                User.findOne({_id: req.body.sender}, (err, user) => {
                    user.friends +=1;
                    user.save()
                })
            }
            else if (!friendObj.sent_request_to.includes(req.body.receiver)){
                friendsObj.sent_request_to.push(req.body.receiver)
            }
        friendObj.save()
        }
    })
    res.send({})
    Friend.findOne({_id: req.body.receiver}, (err, friendObj) => {
        if (err) {
            console.log(err);
        }
        else {
            if (!friendObj.received_request_from.includes(req.body.sender)) {
                friendsObj.received_request_from.push(req.body.sender)
            }
            else if (friendObj.sent_request_to.includes(req.body.sender)){
                friendObj.friends.push(req.body.sender)
                User.findOne({_id: req.body.receiver}, (err, user) => {
                    user.friends +=1;
                    user.save()
                })
            }
        friendObj.save()
        }
    });
})

router.get('/friend', function(req, res) {
    Friend.findOne({ _id: req.query._id }, function(err, user) {
        if(err) {
            console.log(err)
        }
      res.send(user);
    });
  });

  // note that it is req.query.id and not req.query._id
  router.get('/song_info', function(req, res) {
    Friend.findOne({ id: req.query.id }, function(err, song) {
        if(err) {
            console.log(err)
        }
      res.send(song);
    });
  });

  router.post('/song_info_comment', function(req, res) {
    connect.ensureLoggedIn();
    SongComment.findOne({ id: req.query.id }, function(err, song) {
        if(err) {
            const newSongComment = SongComment({
                id: req.query.id,
                comment: [req.body.comment],
            })
        }
        else {
            song.comment.push(req.body.comment);
            song.save();
        }
      res.send(song);
    });
  });

  

module.exports = router;