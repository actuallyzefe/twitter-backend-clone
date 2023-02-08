const express = require('express');
const app = require('../app');
const { signup, login, getAllUsers } = require('../controllers/authController');

const router = express.Router();
router.route('/allUsers').get(getAllUsers);

router.route('/signup').post(signup);
router.route('/login').post(login);

module.exports = router;
