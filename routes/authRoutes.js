const express = require('express');
const app = require('../app');
const { signup, login, getAllUsers } = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);

router.route('/allUsers').get(getAllUsers);

module.exports = router;
