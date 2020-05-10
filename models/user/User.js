const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const hashPassword = require('./functions/hashPassword');
const verifyPassword = require('./functions/verifyPassword');

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    default: ""
  },
  birth_time: {
    type: Object,
    default: {}
  },
  languages: {
    type: Array,
    default: []
  },
  school: {
    type: String, 
    default: ""
  },
  completed: {
    type: Boolean,
    default: false
  },
  profile_photo: {
    type: String,
    default: "https://res.cloudinary.com/dvnac86j8/image/upload/v1566558525/learch/defaultUserPicture.png"
  },
  not_read_message_number: {
    type: Number,
    default: 0
  },
  chat_list: {
    type: Array,
    default: []
  },
  requests: {
    type: Array,
    default: []
  },
  requested_users: {
    type: Array,
    default: []
  },
  old_users: {
    type: Array,
    default: []
  }
});

UserSchema.pre('save', hashPassword);

UserSchema.statics.findUser = function (email, password, callback) {
  let User = this;

  User.findOne({email}).then(user => { 
    if (!user) {
        return callback(true);
    }

    verifyPassword(password, user.password, (res) => {
      if (res) return callback(null, user);
      
      return callback(true);
    });
  });
};

module.exports = mongoose.model('User', UserSchema);
