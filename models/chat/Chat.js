const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  user_one: {
    type: Object,
    required: true
  },
  user_two: {
    type: Object,
    required: true
  },
  messages: {
    type: Array,
    default: []
  },
  created_at: {
    type: Date,
    default: (new Date()).getTime()
  }
});

module.exports = mongoose.model('Chat', ChatSchema);
