const User = require('../models/UserModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const { sign } = require('crypto');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  try {
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
  } catch (e) {
    res.status(409).json({
      msg: e,
    });
    console.log(e);
  }
});

exports.login = catchAsync(async (req, res) => {
  const nickname = req.body.nickname;
  const password = req.body.password;

  try {
    if (!nickname || !password) {
      res.status(400).json({
        status: 'Fail',
        msg: 'Please provide nickname password',
      });
    }
    const user = await User.findOne({ nickname }).select('+password');
    if (!user || !(await user.comparePassword(password, user.password))) {
      res.status(400).json({
        status: 'Fail',
        msg: 'Incorrect nickname or password',
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
    res.send(e);
  }
});

exports.protet = catchAsync(async (req, res, next) => {
  //1) Getting token and check if it exists

  //2) Verification token

  //3) Check if user exists

  //4) Check if user changed password after the token was issued

  // GRANT ACCESS TO PROTECTED ROUTES
  req.user = currentUser;
});

exports.updateNick = async (req, res) => {};

exports.updatePassword = async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');
  // 2) Check if POSTed current password is correct
  if (!(await user.comparePassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('INCORRECT PASSWORD', 401));
  }
  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // 4) Log user in, send JWT
  const token = signToken(user.id);
  res.json({
    status: 'Success',
    token: token,
  });
};

exports.forgotPassword = async (req, res) => {};
