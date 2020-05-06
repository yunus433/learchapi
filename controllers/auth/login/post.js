const User = require('../../../models/user/User');

const getUserObject = require('../../../utils/getUserObject');

module.exports = (req, res, next) => {
  if (!req.body || !req.body.email || !req.body.password)
    return res.status(400).json({ error: "bad request" });

  User.findUser(req.body.email, req.body.password, (err, user) => {
    if (err || !user)
      return res.status(400).json({ error: "user not found" });

    if (user.completed)
      return res.status(200).json({ user: getUserObject(user) });
    else
      return res.status(200).json({ user });
  });
}
