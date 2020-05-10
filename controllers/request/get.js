const mongoose = require('mongoose');
const async = require('async');

const User = require('../../models/user/User');

module.exports = (req, res) => {
  if (!req.query || !req.query.id)
    return res.status(400).json({ error: 'bad request' });

  User.findById(mongoose.Types.ObjectId(req.query.id), (err, user) => {
    if (err) return res.status(500).json({ error: 'mongo error: ' + err });

    async.times(
      user.requests.length,
      (time, next) => {
        User.findById(mongoose.Types.ObjectId(user.requests[time]), (err, user) => next(err, user));
      },
      (err, users) => {
        if (err) return res.status(500).json({ error: 'mongo error: ' + err });

        return res.status(200).json({ users });
      }
    );
  });
}
