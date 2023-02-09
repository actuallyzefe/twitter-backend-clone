const User = require('../models/UserModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const { sign } = require('crypto');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'Success',
    data: {
      users,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    nickname: req.body.nickname,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  const token = signToken(newUser._id);

  newUser.password = undefined;
  res.status(201).json({
    status: 'Success',
    token,
    data: newUser,
  });
});

exports.login = catchAsync(async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    if (!email || !password) {
      res.status(400).json({
        status: 'Fail',
        msg: 'Please provide email password',
      });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password, user.password))) {
      res.status(400).json({
        status: 'Fail',
        msg: 'Incorrect email or password',
      });
    }
    user.password = undefined;
    const token = signToken(user._id);
    res.status(200).json({
      status: 'Success',
      token,
      data: user,
    });
  } catch (e) {
    console.log(e);
  }
});

exports.updateNick = async (req, res) => {};
