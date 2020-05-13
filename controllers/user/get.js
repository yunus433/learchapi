const mongoose = require('mongoose');

const User = require('../../models/user/User');

const getUserObject = require('../../utils/getUserObject');

module.exports = (req, res) => {
  if (!req.query || !req.query.id || !req.query.user)
    return res.status(400).json({ error: 'bad request' });

  User.findById(mongoose.Types.ObjectId(req.query.id), (err, user) => {
    if (err || !user) return res.status(400).json({ error: "user not found" });
    
    User.findById(mongoose.Types.ObjectId(req.query.user), (err, profile) => {
      if (err || !user) return res.status(400).json({ error: "user not found" });

      return res.status(200).json({
        user: getUserObject(profile),
        already_requested: user.old_users.includes(profile._id.toString()) || user.requested_users.includes(profile._id.toString())
      });
    });
  });
}
