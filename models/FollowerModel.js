const { default: mongoose, Schema } = require('mongoose');
const User = require('./UserModel');

const Follow = new mongoose.Schema({
  follower: {
    type: Number,
    required: true,
    ref: 'User',
  },
  following: {
    type: Number,
  },
});
