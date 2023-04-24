const Post = require('../models/PostModel');
const AppError = require('../utils/appError');

exports.isCorrectUser = async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (req.user.id !== post.user.id) {
    return next(new AppError('You can only delete your own posts', 403));
  }

  return next();
};
