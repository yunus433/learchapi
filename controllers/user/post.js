const mongoose = require('mongoose');
const async = require('async');

const User = require('../../models/user/User');

const getUserObject = require('../../utils/getUserObject');

module.exports = (req, res) => {
  if (!req.body || !req.body.id)
    return res.status(400).json({ error: 'bad request' });

  User.findById(mongoose.Types.ObjectId(req.body.id), (err, user) => {
    if (err) return res.status(500).json({ error: 'mongo error: ' + err });

    User.find({
      _id: { 
        $nin: user.old_users.concat(req.body.id).concat(user.requested_users)
      },
      completed: true
    }, (err, users) => {
      if (err) return res.status(500).json({ error: "mongo error: " + err });
  
      async.times(
        users.length,
        (time, next) => {
          next(null, getUserObject(users[time]));
        },
        (err, users) => {
          if (err) return res.status(500).json({ error: err });
  
          return res.status(200).json({ users });  
        }
      );
    });
  });
}
