const express = require('express');
const authController = require('./../controllers/authController');
const postController = require('./../controllers/postController');
const router = express.Router();

router.get('/allTweets', postController.getAllTweets);

router.use(authController.protect);
router.route('/:id/deletePost').delete(postController.deletePost);
router
  .route('/createPost')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    postController.createPost
  );
router.patch('/:id/likePost', postController.likePost);
router.patch('/:id/dislikePost', postController.dislikePost);

module.exports = router;
