const mongoose = require('mongoose');

const User = require('../../../models/user/User');

const getUserObject = require('../../../utils/getUserObject');

module.exports = (req, res) => {
  if (!req.file || !req.query || !req.query.id)
    return res.status(400).json({ error: "bad request" });

  User.findById(mongoose.Types.ObjectId(req.query.id), (err, old_user) => {
    if (err || !old_user) return res.status(500).json({ error: "user not found" });

    req.cloudinary.v2.uploader.upload(
      "./public/res/uploads/" + req.file.filename,
      {
        public_id: "learch/profile_photo/" + req.file.filename,
        quality: 25,
        format: "JPG",
        secure: true
      },
      (err, result) => {
        if (err) return res.status(500).json({ error: "cloudinary error: " + err });

        User.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.id), {$set: {
          profile_photo: result.secure_url
        }}, {new: true}, (err, user) => {
          if (err || !user) return res.status(400).json({ error: "mongo error: " + err });
          
          if ( old_user.profile_photo != "https://res.cloudinary.com/dvnac86j8/image/upload/v1566558525/learch/defaultUserPicture.png" ) {
            req.cloudinary.v2.uploader.destroy(
              "learch/profile_photo/" +
                old_user.profile_photo
                  .split("/")
                  [old_user.profile_photo.split("/").length - 1].split(".")[0],
              err => {
                if (err) res.sendStatus(500);

                fs.unlink(
                  "./public/res/uploads/" + req.file.filename,
                  err => {
                    if (err) res.sendStatus(500);

                    return res.status(200).json({ user: getUserObject(user) });
                  }
                );
              }
            );
          } else {
            fs.unlink("./public/res/uploads/" + req.file.filename, err => {
              if (err) res.sendStatus(500);

              return res.status(200).json({ user: getUserObject(user) });
            });
          }
        })
      });
  });
}
