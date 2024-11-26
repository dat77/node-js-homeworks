const Tweet = require('../models/tweetModel');

exports.getTweets = (req, res) => {
    res.json(Tweet.getAll());
};

exports.createTweet = (req, res) => {
    const { content } = req.body;
    const tweet = Tweet.create({ content, username: req.user.username });
    res.status(201).json(tweet);
};

exports.deleteTweet = (req, res) => {
    const { id } = req.params;
    Tweet.delete(id);
    res.status(200).json({ message: 'Tweet deleted' });
};
