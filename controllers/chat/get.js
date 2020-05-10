const mongoose = require('mongoose');
const async = require('async');

const User = require('../../models/user/User');
const Chat = require('../../models/chat/Chat');

module.exports = (req, res) => {
  if (!req.query || !req.query.id)
    return res.status(400).json({ error: 'bad request' });

  User.findById(mongoose.Types.ObjectId(req.query.id), (err, user) => {
    if (err) return res.status(500).json({ error: 'mongo error: ' + err });

    async.times(
      user.chat_list.length,
      (time, next) => {
        Chat.findById(mongoose.Types.ObjectId(user.chat_list[time]), (err, chat) => {
          if (chat.user_two._id.toString() == req.query.id) {
            const temp = chat.user_two;
            chat.user_two = chat.user_one;
            chat.user_one = temp;
          }

          next(err, chat)
        });
      },
      (err, chat_list) => {
        if (err) return res.status(500).json({ error: 'mongo error: ' + err });

        return res.status(200).json({ chat_list });
      }
    )
  })
}
