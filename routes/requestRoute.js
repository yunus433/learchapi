const express = require('express');

const router = express.Router();

const isAPIAuthenticated = require('../middleware/isAPIAuthenticated');

const newGetController = require('../controllers/request/get');

const newPostController = require('../controllers/request/post');

router.get(
  '/',
  isAPIAuthenticated,
  newGetController
);

router.post(
  '/',
  isAPIAuthenticated,
  newPostController
);

module.exports = router;
