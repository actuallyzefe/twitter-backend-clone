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
  const post = await Post.findByIdAndDelete(req.params.id);

  if (!post) {
    res.status(404).json({
      Stuats: 'Fail',
      msg: 'No post found with that ID',
    });
  }

  res.status(204).json({
    Status: 'Success',
    msg: 'Deleted',
  });
  next();
};
