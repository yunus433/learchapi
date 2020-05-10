const express = require('express');

const router = express.Router();

const isAPIAuthenticated = require('../middleware/isAPIAuthenticated');

const indexGetController = require('../controllers/chat/get');

const indexPostController = require('../controllers/chat/post');

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
