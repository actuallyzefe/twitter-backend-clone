const express = require('express');

const {
  signup,
  login,
  updatePassword,
  updateNick,
} = require('../controllers/authController');
const authController = require('../controllers/authController');
const passValidation = require('../middlewares/passConfirm');
const router = express.Router();

// auth
router.route('/signup').post(passValidation.passConfirm, signup);
router.route('/login').post(login);
router.post('/forgotPassword', authController.forgotPassword);
router.use(authController.protect);
router.route('/updateMyPassword').patch(updatePassword);

module.exports = router;
