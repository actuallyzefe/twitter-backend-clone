const express = require('express');
const app = require('../app');
const { signup } = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(signup);

module.exports = router;
