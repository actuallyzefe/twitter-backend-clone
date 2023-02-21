const { findOne, findById } = require('./../models/PostModel');
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
  const newPost = await Post.create(req.body);
  if (!req.body.user) req.body.user = req.user.id;

  res.status(201).json({
    status: 'Success',
    data: {
      post: newPost,
      postedBy: user,
    },
  });
};
