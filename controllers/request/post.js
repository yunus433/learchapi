const mongoose = require('mongoose');

const User = require('../../models/user/User');
const Chat = require('../../models/chat/Chat');

const getUserObject = require('../../utils/getUserObject');

module.exports = (req, res) => {
  if (!req.body || !req.body.id || !req.body.user)
    return res.status(400).json({ error: 'bad request' });
  
  User.findById(mongoose.Types.ObjectId(req.body.id), (err, user) => {
    if (err) return res.status(500).json({ error: 'mongo error: ' + err });

    if (user.requested_users.includes(req.body.user.toString()))
      return res.status(500).json({ error: 'already requested user' });

    if (user.requests.includes(req.body.user.toString())) {
      User.findById(mongoose.Types.ObjectId(req.body.id.toString()), (err, user_two) => {
        if (err) return res.status(500).json({ error: 'mongo error: ' + err });

        const newChatData = {
          user_one: getUserObject(user),
          user_two: getUserObject(user_two)
        };

        const newChat = new Chat(newChatData);

        newChat.save((err, chat) => {
          if (err) return res.status(500).json({ error: 'mongo error: ' + err });

          User.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.id), {
            $pull: {
              requests: req.body.user.toString()
            },
            $push: {
              chat_list: chat._id.toString(),
              old_users: req.body.user.toString()
            }
          }, {}, err => {
            if (err) return res.status(500).json({ error: 'mongo error: ' + err });
    
            User.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.user), {
              $pull: {
                requested_users: req.body.id.toString()
              },
              $push: {
                chat_list: chat._id.toString(),
                old_users: req.body.id.toString()
              }
            }, {}, err => {
              if (err) return res.status(500).json({ error: 'mongo error: ' + err });
    
              return res.status(200).json({ new_chat: true });
            });
          });
        });
      });
    } else {
      User.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.id), {$push: {
        requested_users: req.body.user.toString()
      }}, {}, err => {
        if (err) return res.status(500).json({ error: 'mongo error: ' + err });
  
        User.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.user), {$push: {
          requests: req.body.id.toString()
        }}, {}, err => {
          if (err) return res.status(500).json({ error: 'mongo error: ' + err });
        
          return res.status(200).json({ new_chat: false });
        });
      });
    }
  });
}
