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
                index = friendObj.received_request_from.indexOf(req.body.receiver);
                friendObj.received_request_from.splice(index, 1);
            }
            else if (!friendObj.sent_request_to.includes(req.body.receiver)){
                friendObj.sent_request_to.push(req.body.receiver)
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
            if (friendObj.sent_request_to.includes(req.body.sender)){
                friendObj.friends.push(req.body.sender)
                User.findOne({_id: req.body.receiver}, (err, user) => {
                    user.friends +=1;
                    user.save()
                })
                index = friendObj.sent_request_to.indexOf(req.body.sender);
                friendObj.sent_request_to.splice(index, 1);
            }
            if (!friendObj.received_request_from.includes(req.body.sender)) {
                friendObj.received_request_from.push(req.body.sender)
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
    SongComment.findOne({ id: req.query.id }, function(err, song) {
        if(err) {
            console.log(err)
        }
        console.log("random: "+ req.query.random)
        console.log("comment: "+song.comments[req.query.random])
      res.send(song.comments[req.query.random]);
    });
  });

    // note that it is req.query.id and not req.query._id
    router.get('/song_info_length', function(req, res) {
        SongComment.findOne({ id: req.query.id }, function(err, song) {
            if(err) {
                console.log(err)
            }
            if(!song)
            {
                res.send(null)
            }
            else {
                console.log("song comments: "+song.comments)
                res.send(song.comments);
            }
        });
        });

  router.post('/song_info_comment', function(req, res) {
    connect.ensureLoggedIn();
    SongComment.findOne({ id: req.query.id }, function(err, song) {
        if(err) {
            console.log(err);
        }
        else {
            if(song) {
                song.comments.push(req.body.comment);
                song.save();
            }
            else {
                const newSongComment = SongComment({
                    id: req.query.id,
                    comment: [],
                })
                newSongComment.comments.push(req.body.comment);
                newSongComment.save();
            }
        }
    res.send({status: 'success'});
    });
  });

  

module.exports = router;