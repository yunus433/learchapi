module.exports = (req, res, next) => {
  if (req.session && req.session.admin) {
    next();
  } else {
    res.redirect('/admin/auth');
  };
};
