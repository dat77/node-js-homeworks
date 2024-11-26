const express = require('express');
const userService = require('../services/userService');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/profile', authMiddleware, userService.getUserProfile);

module.exports = router;
