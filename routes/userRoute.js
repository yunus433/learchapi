const express = require('express');

const router = express.Router();

const isAPIAuthenticated = require('../middleware/isAPIAuthenticated');

const indexGetController = require('../controllers/user/get');

const indexPostController = require('../controllers/user/post');

router.get(
  '/',
  isAPIAuthenticated,
  indexGetController
);

router.post(
  '/',
  isAPIAuthenticated,
  indexPostController
);

module.exports = router;
