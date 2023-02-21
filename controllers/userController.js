const User = require('../models/UserModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'Success',
    users: users.length,
    data: {
      users,
    },
  });
};

exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id).populate('tweets');
  if (!user) {
    res.status(404).json({
      Status: 'Fail',
      msg: 'No user found with that ID',
    });
  }

  res.status(200).json({
    status: 'Success',
    user,
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create Error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for update Passwords. Please try  /updateMyPassword',
        400
      )
    );
  }
  // 2) Update User Document
  const filteredBody = filterObj(req.body, 'name', 'email', 'nickname', 'bio'); // burada sadece nelerin update edielceğine izin verceğimizi seçtik
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    // findByIdAndUpdatede de bunu kullandık
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'Success',
    data: updatedUser,
  });
  next();
});

// FOLLOW UNFOLLOW LOGIC

// follow part // NEED REFACTOR
exports.followUser = async (req, res, next) => {
  const currentUserNick = req.user.nickname;
  const otherUserNick = req.body.nickname;

  if (otherUserNick !== currentUserNick) {
    try {
      const user = await User.findOne({ nickname: currentUserNick });
      const otherUser = await User.findOne({ nickname: otherUserNick });

      if (!otherUser.followers.includes(currentUserNick)) {
        await user.updateOne({
          $push: { followings: otherUserNick },
        });
        // await user.save();

        await otherUser.updateOne({
          $push: { followers: currentUserNick },
        });
        // await otherUser.save();
      } else {
        res.status(403).json({
          status: 'Fail',
          msg: 'you are already following this',
        });
        next();
      }

      res.status(200).json({
        stauts: 'Success',
        msg: `${otherUserNick} followed`,
      });
    } catch (e) {
      res.status(500).json({
        status: 'Fail',
        msg: e,
      });
      console.log(e);
      next();
    }
  } else {
    res.status(403).json({
      status: 'Fail',
      msg: 'You cant follow yourself',
    });
    next();
  }
  next();
};

// UNFOLLOW PART -- WILL BE REFACTORED
exports.unfollowUser = async (req, res, next) => {
  const currentUserNick = req.user.nickname;
  const otherUserNick = req.body.nickname;

  if (otherUserNick !== currentUserNick) {
    try {
      const user = await User.findOne({ nickname: currentUserNick });
      const otherUser = await User.findOne({ nickname: otherUserNick });

      if (otherUser.followers.includes(currentUserNick)) {
        await user.updateOne({
          $pull: { followings: otherUserNick },
        });
        // await user.save();

        await otherUser.updateOne({
          $pull: { followers: currentUserNick },
        });
        // await otherUser.save();
      } else {
        res.status(403).json({
          status: 'Fail',
          msg: 'you cant unfollow this user',
        });
        next();
      }

      res.status(200).json({
        stauts: 'Success',
        msg: `${otherUserNick} unfollowed`,
      });
    } catch (e) {
      res.status(500).json({
        status: 'Fail',
        msg: e,
      });
      console.log(e);
      next();
    }
  } else {
    res.status(403).json({
      status: 'Fail',
      msg: 'You cant unfollow yourself',
    });
    next();
  }
  next();
};
