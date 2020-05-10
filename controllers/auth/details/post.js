const mongoose = require('mongoose');

const User = require('../../../models/user/User');

const getUserObject = require('../../../utils/getUserObject');

module.exports = (req, res, next) => {
  if (!req.body || !req.body.id || !req.body.name || !req.body.school || !req.body.birth_time)
    return res.status(400).json({ error: "bad request" });

  User.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.id), {$set: {
    name: req.body.name,
    school: req.body.school,
    birth_time: req.body.birth_time,
    languages: req.body.languages,
    completed: true
  }}, {new: true}, (err, user) => {
    if (err || !user) return res.status(500).json({ error: "mongo error: " + err });

    return res.status(200).json({ user: getUserObject(user) });
  });
}
