import { strict } from 'assert';
import mongoose, { Schema } from 'mongoose';
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },

  password: {
    type: String,
    required: [true, 'Please enter a password'],
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
