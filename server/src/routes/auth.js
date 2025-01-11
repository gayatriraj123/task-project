const express = require('express');
const { signup, login } = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middleware/validate');

const router = express.Router();

// @route   POST /api/auth/signup
router.post('/signup', validateSignup, signup);

// @route   POST /api/auth/login
router.post('/login', validateLogin, login);

module.exports = router; 