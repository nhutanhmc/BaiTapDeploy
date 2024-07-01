const express = require('express');
const router = express.Router();
const passport = require('../passportConfig'); // Import passport configuration
const staffController = require('../controllers/staffController');

// Đăng nhập bằng Google
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback từ Google sau khi xác thực
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/sign-in' }),
  staffController.googleAuthCallback
);

// Đăng nhập bằng JWT
router.post('/login', staffController.loginWithJWT);

// Refresh token
router.post('/refresh-token', staffController.refreshAccessToken);

// Đăng ký tài khoản
router.post('/signup', staffController.signUp);

// Lấy danh sách người dùng
router.get('/users', staffController.getAllUsers);

module.exports = router;
