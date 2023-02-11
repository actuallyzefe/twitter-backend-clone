const User = require('../models/UserModel');

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

exports.me = async (req, res) => {};
