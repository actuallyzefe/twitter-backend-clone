const authController = require('./../controllers/authController');
const {
  getAllUsers,
  updateMe,
  getMe,
  followUser,
  unfollowUser,
} = require('../controllers/userController');

const router = require('express').Router();

router.route('/allUsers').get(getAllUsers);

router.use(authController.protect);
router.route('/updateMe').patch(updateMe);
router.route('/me').get(getMe);
router.route('/followUser').patch(followUser);
router.route('/unfollowUser').patch(unfollowUser);
module.exports = router;
