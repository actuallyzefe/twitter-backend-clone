const express = require('express');
const authController = require('./../controllers/authController');
const postController = require('./../controllers/postController');
const checkUser = require('./../middlewares/checkUser');
const router = express.Router();

router.get('/allTweets', postController.getAllTweets);

router.use(authController.protect);

// Creating Post
router.post(
  '/createPost',
  authController.restrictTo('user'),
  postController.createPost
);

// Liking - Disliking Posts
router.patch('/:id/likePost', postController.likePost);
router.patch('/:id/dislikePost', postController.dislikePost);

// Deleting Posts
router.delete(
  '/:id/deletePost',
  checkUser.isCorrectUser,
  postController.deletePost
);

module.exports = router;
