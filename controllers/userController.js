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

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id; // AuthController kısmında user infosunu çekebiliyorduk => exports.protect kısmının sonunda hazırladık
  next();
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

exports.followUser = async (req, res, next) => {
  const currentUserNick = req.user.nickname;
  const otherUserNick = req.body.nickname;

  if (req.body.nickname !== req.user.nickname) {
    try {
      const user = await User.findOne({ currentUserNick });
      const otherUser = await User.findOne({ otherUserNick });

      if (!otherUser.followers.includes(req.user.nickname)) {
        await user.updateOne({
          $push: { followings: req.body.nickname },
        });
        await otherUser.updateOne({
          $push: { followers: req.user.nickname },
        });
      } else {
        res.status(403).json({
          status: 'Fail',
          msg: 'you are already following this',
        });
        next();
      }

      res.status(400).json({
        stauts: 'Success',
        msg: `${req.body.nickname} followed`,
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
