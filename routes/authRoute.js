const express = require('express');
const multer = require('multer');

const upload = multer({ dest: './public/res/uploads/' });
const router = express.Router();

const isAPIAuthenticated = require('../middleware/isAPIAuthenticated');

const loginPostController = require('../controllers/auth/login/post');
const registerPostController = require('../controllers/auth/register/post');
const detailsPostController = require('../controllers/auth/details/post');

router.post(
  '/login',
  isAPIAuthenticated,
  loginPostController
);
router.post(
  '/register',
  isAPIAuthenticated,
  registerPostController
);
router.post(
  '/details',
  upload.single('photo'),
  isAPIAuthenticated,
  detailsPostController
);

module.exports = router;
