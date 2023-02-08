const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

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

  newUser.password = undefined;
  res.status(201).json({
    status: 'Success',
    data: newUser,
  });
});

exports.login = async (req, res) => {
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
    res.status(200).json({
      status: 'Success',
      data: user,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.updateNick = async (req, res) => {};
