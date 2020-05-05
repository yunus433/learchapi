module.exports = (req, res, next) => {
  if (req.get("x_auth") && req.get("x_auth") == process.env.API_AUTHENTICATION_TOKEN) {
    next();
  } else {
    res.status(401).json({"error": "not authenticated request"});
  }
}
