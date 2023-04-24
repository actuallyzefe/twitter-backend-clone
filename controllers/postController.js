const AppError = require('../utils/appError');
const Post = require('./../models/PostModel');

exports.getAllTweets = async (req, res) => {
  const tweets = await Post.find();

  res.status(200).json({
    status: 'Success',
    data: {
      tweets,
    },
  });
};

exports.createPost = async (req, res) => {
  if (!req.body.user) req.body.user = req.user.id;
  const newPost = await Post.create(req.body);

  res.status(201).json({
    status: 'Success',
    data: {
      post: newPost,
    },
  });
};

exports.deletePost = async (req, res, next) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);

    if (!deletedPost) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    next(err);
  }
  next();
};

exports.likePost = async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  const user = req.user.nickname;
  if (!post) {
    return next(new AppError('No document found with that ID', 404));
  }
  if (!post.likes.includes(user)) {
    await post.updateOne({ $push: { likes: user } });
    res.status(200).json({
      Status: 'Success',
      msg: 'Post liked',
    });
  }
};

exports.dislikePost = async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  const user = req.user.nickname;
  if (!post) {
    return next(new AppError('No document found with that ID', 404));
  }

  if (post.likes.includes(user)) {
    await post.updateOne({ $pull: { likes: user } });
    res.status(200).json({
      Status: 'Success',
      msg: 'Post disliked',
    });
  }
};
