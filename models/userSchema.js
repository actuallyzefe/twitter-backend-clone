const mongoose = require('mongoose');
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
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // THIS ONLY WORKS on CREATE and SAVE
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not same',
    },
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
