const validator = require('validator');

const User = require('../../../models/user/User');

module.exports = (req, res, next) => {
  if (!req.body || !req.body.email || !req.body.password)
    return res.status(400).json({ error: "bad request" });

  if (!validator.isEmail(req.body.email))
    return res.status(400).json({ error: "not valid email" });

  const newUserData = {
    email: req.body.email,
    password: req.body.password
  }; 

  const newUser = new User(newUserData);

  newUser.save((err, user) => {
    if (err && err.code == 11000)
      return res.status(400).json({ error: "already taken email" });

    if (err || !user) return res.status(500).json({ error: "mongo error: " + err });

    return res.status(200).json({ user });
  });
}
