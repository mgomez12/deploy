// dependencies
const express = require('express');
const connect = require('connect-ensure-login');

// models
const User = require('../models/user');

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
module.exports = router;