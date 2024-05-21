var express = require('express');
const router = express.Router();
var staffController = require('../controller/staffController');

router.post('/loginWithJWT', staffController.loginWithJWT);
router.get('/logout', staffController.logout);
router.post('/signup', staffController.signUp);
router.get('/getAllUser', staffController.getAllUsers);

module.exports = router;
