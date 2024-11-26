const User = require('../models/userModel');

exports.getUserProfile = (req, res) => {
    const user = User.findByUsername(req.user.username);
    res.json({ profile: user });
};
