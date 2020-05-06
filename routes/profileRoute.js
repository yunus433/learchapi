const express = require('express');
const multer = require('multer');

const upload = multer({ dest: './public/res/uploads/' });
const router = express.Router();

const isAPIAuthenticated = require('../middleware/isAPIAuthenticated');

const profilephotoPostController = require('../controllers/profile/profilephoto/post');

router.post(
  '/profilephoto',
  upload.single('file'),
  isAPIAuthenticated,
  profilephotoPostController
);

module.exports = router;
