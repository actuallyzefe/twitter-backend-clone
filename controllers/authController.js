const User = require('../models/UserModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const {
    name,
    nickname,
    email,
    password,
    passwordConfirm,
    passwordChangedAt,
  } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send('Email in use');
    const newUser = await User.create({
      name,
      nickname,
      email,
      password,
      passwordConfirm,
      passwordChangedAt,
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
  const { nickname, password } = req.body;

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

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //1) Getting token and check if it exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new AppError('You are not Logged in.', 401));
  }
  //2) Verification token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //3) Check if user exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('This user no longer exists', 401));
  }
  //4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('USER RECENTLY CHANGED PASSWORD'));
  }
  // GRANT ACCESS TO PROTECTED ROUTES
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

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

exports.forgotPassword = async (req, res, next) => {
  // 1) Get user based on POSTed email
  let { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }
  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (e) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
};
exports.resetPassword = async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user => userModel middleware
  // 4) Log the user in, send JWT
  const token = signToken(user._id);
  res.status(200).json({
    status: 'Success',
    token: token,
  });
};
