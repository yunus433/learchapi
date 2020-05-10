const mongoose = require('mongoose');

const User = require('../../models/user/User');
const Chat = require('../../models/chat/Chat');

module.exports = (req, res) => {
  if (!req.body || !req.body.id || !req.body.user || !req.body.chat_id)
    return res.status(400).json({ error: 'bad request' });

  Chat.findByIdAndDelete(mongoose.Types.ObjectId(req.body.chat_id), err => {
    if (err) return res.status(500).json({ error: 'mongo error: ' + err });

    User.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.id), {$pull: {
      chat_list: req.body.chat_id
    }}, {}, err => {
      if (err) return res.status(500).json({ error: 'mongo error: ' + err });

      User.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.user), {$pull: {
        chat_list: req.body.chat_id
      }}, {}, err => {
        if (err) return res.status(500).json({ error: 'mongo error: ' + err });
  
        return res.status(200).json({ success: true });
      });
    });
  });
}
