const { getAllUsers } = require('../controllers/userController');

const router = require('express').Router();

router.route('/allUsers').get(getAllUsers);
router.route('/me').get();
module.exports = router;
