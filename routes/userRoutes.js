const authController = require('./../controllers/authController');
const {
  getAllUsers,
  updateMe,
  followUser,
  unfollowUser,
  getUser,
} = require('../controllers/userController');

const router = require('express').Router();

router.route('/allUsers').get(getAllUsers);
router.get('/:id/getUser', getUser);

router.use(authController.protect);
router.route('/updateMe').patch(updateMe);
router.route('/followUser').patch(followUser);
router.route('/unfollowUser').patch(unfollowUser);
module.exports = router;
