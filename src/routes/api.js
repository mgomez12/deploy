// dependencies
const express = require('express');
const connect = require('connect-ensure-login');

// models
const Story = require('../models/story');
const Comment = require('../models/comment');

const router = express.Router();


module.exports = router;
