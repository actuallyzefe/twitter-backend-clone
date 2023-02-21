const express = require('express');
const authController = require('./../controllers/authController');
const postController = require('./../controllers/postController');
const router = express.Router();

router.get('/allTweets', postController.getAllTweets);

router.use(authController.protect);
router
  .route('/createPost')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    postController.createPost
  );

module.exports = router;
