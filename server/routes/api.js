
// dependencies
const express = require('express');
const connect = require('connect-ensure-login');
const request = require('request-promise');

// models
const User = require('../models/user');
const Suggestion = require('../models/suggestion');
const Friend = require('../models/friends');
const SongComment = require('../models/songcomment');


const router = express.Router();


router.get('/user', function(req, res) {
    if (req.query.fields) {
        const fields = req.query.fields
        console.log('fields:' + fields)
        User.findOne({ _id: req.query._id },fields, function(err, user) {
            if(err) {
                console.log(err)
            }
            console.log('user: ' + user)
          res.send(user);
        });
    }
    else {
        User.findOne({ _id: req.query._id }, function(err, user) {
            if(err) {
                console.log(err)
            }
          res.send(user);
        });
    }
    
  });


  
router.get('/allusers', function(req, res) {
    User.find({}, '_id name image', function(err, users) {
        if(err) {
            console.log(err)
        }
        res.send(users);
    });
    User.find()
});

router.get('/refresh', function(req, res) {
    const currentTime = new Date()
    if(req.isAuthenticated() && currentTime.getTime() < req.user.expire_time) {
        User.findOne({ _id: req.user._id}, function(err, user) {
            if(err) {
                console.log(err)
                res.send(err)
            }
            else {
                req.logOut();
                req.login(user, (err) => {console.log(err)});
                res.send(req.user);
            }
    })
    }

    else if (req.isAuthenticated()) {
        const params = {
            'grant_type': 'refresh_token',
            'refresh_token': req.user.refresh_token
        }
        const searchParams = Object.keys(params).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
          }).join('&');

          var recently_played = {
            method: 'POST',
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Authorization': 'Basic ' + Buffer.from(process.env.clientID + ':' + process.env.clientSecret).toString('base64')
              },
            body: searchParams,
            json: true
          }
          request(recently_played)
          .then(tokenInfo => {
              User.findOne({ _id: req.user._id}, function(err, user) {
            if(err) {
                console.log(err)
                res.send(err)
            }
            else {
                user.access_token = tokenInfo.access_token
                user.expire_time = new Date(new Date().getTime() + tokenInfo.expires_in * 1000).getTime()
                user.save()
                req.logOut();
                req.login(user, (err) => {console.log(err)});
                res.send(req.user);
            }
          })})

    }
    else{
        res.send({});
    }
    });


router.get("/suggestion", function(req, res) {
    connect.ensureLoggedIn();
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
    console.log('name ' + req.body.name)
    
    User.findOne({_id: req.body.receiver}, (err, receiverProfile) => {
        if (!receiverProfile) {
            res.send({status: 'fail'});
        }
        else {
            let rec = receiverProfile
            const suggestion_length = receiverProfile.suggestions_received.length;
            if(suggestion_length > 50) {
                receiverProfile.suggestions_received = receiverProfile.suggestions_received.slice(suggestion_length-49,suggestion_length)
                receiverProfile.suggestions_received.push(req.body.uri)
            }
            else {
                receiverProfile.suggestions_received.push(req.body.uri)
            }
            res.send({status: 'success'});
            let senderName;
            if (req.body.sender == 'anonymous') {
                senderName = 'Someone secret'
                message = {sender: req.body.sender, title: req.body.name, name: senderName, type: 'suggestion'}
                rec.notifications.push(message)
                rec.save();
                global.io.emit('notification_' + req.body.receiver, message)
            }
            else {
                User.findOne({_id: req.body.sender}, 'name', (err, user) => {
                    senderName = user.name
                    message = {sender: req.body.sender, title: req.body.name, name: senderName, type: 'suggestion'}
                    rec.notifications.push(message)
                    rec.save();
                    global.io.emit('notification_' + req.body.receiver, message)
                })
            }

        newSuggestion.save();
        }
    });
})

router.post('/description', function(req, res) {
    connect.ensureLoggedIn();
    User.findOne({_id: req.body.user_id}, (err, userInfo) => {
        userInfo.descrip=req.body.bio
        userInfo.save()
        console.log(userInfo.descrip)
    })
    res.send({status: 'success'});

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
            let message = {}
            if (friendObj.sent_request_to.includes(req.body.sender)){
                User.findOne({_id: req.body.sender}, 'name', (err, user) => {
                    senderName = user.name
                message = {sender: req.body.sender, name:senderName, type: 'friend'}
                User.findOne({_id: req.body.receiver}, (err, user) => {
                    user.friends +=1;
                    user.notifications.push(message)
                    user.save()
                    global.io.emit('notification_' + req.body.receiver, message)
                })})
                friendObj.friends.push(req.body.sender)
                index = friendObj.sent_request_to.indexOf(req.body.sender);
                friendObj.sent_request_to.splice(index, 1);
            }
            else if (!friendObj.received_request_from.includes(req.body.sender)) {
                console.log('setting true');
                let senderName;
                User.findOne({_id: req.body.sender}, 'name', (err, user) => {
                    senderName = user.name
                    message = {sender: req.body.sender, name: senderName, type: 'sent'}
                    User.findOne({_id: req.body.receiver}, (err, user) => {
                        user.notifications.push(message);
                        user.unread_notifications = true;
                        user.save()
                        global.io.emit('notification_' + req.body.receiver, message)
                    })})
                    friendObj.received_request_from.push(req.body.sender)
            }
        friendObj.save()
        }
    });
})

router.post('/friend_remove', function(req, res) {
    connect.ensureLoggedIn();
    Friend.findOne({_id: req.body.sender}, (err, friendObj) => {
        if (err) {
            console.log(err);
        }
        else {
            var index = friendObj.friends.indexOf(req.body.receiver);
            if (index > -1) {
                friendObj.friends.splice(index, 1);
            }
            User.findOne({_id: req.body.sender}, (err, user) => {
                user.friends -=1;
                user.save()
            })
            friendObj.save()
        }
    })
    res.send({})
    Friend.findOne({_id: req.body.receiver}, (err, friendObj) => {
        if (err) {
            console.log(err);
        }
        else {
            var index = friendObj.friends.indexOf(req.body.sender);
            if (index > -1) {
                friendObj.friends.splice(index, 1);
            }
            User.findOne({_id: req.body.receiver}, (err, user) => {
                user.friends -=1;
                user.save()
            })
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