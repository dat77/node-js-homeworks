const express = require('express');
const tweetService = require('../services/tweetService');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware, tweetService.getTweets);
router.post('/', authMiddleware, tweetService.createTweet);
router.delete('/:id', authMiddleware, tweetService.deleteTweet);

module.exports = router;
