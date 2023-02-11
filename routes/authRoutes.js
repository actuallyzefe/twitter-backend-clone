const express = require('express');
const app = require('../app');
const {
  signup,
  login,
  updatePassword,
} = require('../controllers/authController');

const router = express.Router();

// auth
router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/updateMyPassword').patch(updatePassword);

module.exports = router;
