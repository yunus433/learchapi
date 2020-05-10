const express = require('express');

const router = express.Router();

const isAPIAuthenticated = require('../middleware/isAPIAuthenticated');

const indexGetController = require('../controllers/chat/index/get');
const detailsGetController = require('../controllers/chat/details/get');

const indexPostController = require('../controllers/chat/index/post');

router.get(
  '/',
  isAPIAuthenticated,
  indexGetController
);
router.get(
  '/details',
  isAPIAuthenticated,
  detailsGetController
);

router.post(
  '/',
  isAPIAuthenticated,
  indexPostController
);

module.exports = router;
