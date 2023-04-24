const express = require('express');
const authController = require('./../controllers/authController');
const postController = require('./../controllers/postController');
const checkUser = require('./../middlewares/checkUser');
const router = express.Router();

router.get('/allTweets', postController.getAllTweets);

router.use(authController.protect);
router
  .route('/createPost')
  .post(authController.restrictTo('user'), postController.createPost);

router.patch('/:id/likePost', postController.likePost);
router.patch('/:id/dislikePost', postController.dislikePost);

router
  .route('/:id/deletePost')
  .delete(checkUser.checkUser, postController.deletePost);

module.exports = router;
