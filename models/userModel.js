const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have name'],
  },

  nickname: {
    type: String,
    required: [true, 'A user must have nickname'],
    unique: true,
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
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // create ve save için çalışır
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not same',
    },
    select: false,
  },
});

// HASHING

userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.comparePassword = async function (userPass, hashedPass) {
  return await bcrypt.compare(userPass, hashedPass);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
