const mongoose = require('mongoose');

const User = require('../../../models/user/User');
const Chat = require('../../../models/chat/Chat');

const getUserObject = require('../../../utils/getUserObject');

module.exports = (req, res) => {
  if (!req.query || !req.query.id || !req.query.chat_id)
    return res.status(400).json({ error: 'bad request' });

  Chat.findById(mongoose.Types.ObjectId(req.query.chat_id), (err, chat) => {
    if (err) return res.status(500).json({ error: 'mongo error: ' + err });

    if (chat.user_two._id.toString() == req.query.id) {
      const temp = chat.user_two;
      chat.user_two = chat.user_one;
      chat.user_one = temp;
    }

    User.findById(mongoose.Types.ObjectId(chat.user_one._id), (err, user_one) => {
      if (err) return res.status(500).json({ error: 'mongo error: ' + err });

      User.findById(mongoose.Types.ObjectId(chat.user_two._id), (err, user_two) => {
        if (err) return res.status(500).json({ error: 'mongo error: ' + err });
        
        chat.user_one = getUserObject(user_one);
        chat.user_two = getUserObject(user_two);

        return res.status(200).json({ chat });
      });
    });
  });
}
