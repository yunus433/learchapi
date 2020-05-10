const mongoose = require('mongoose');
const moment = require('moment-timezone');

const Chat = require('../models/chat/Chat');
const User = require('../models/user/User');

module.exports = (socket, io) => {
  socket.on('join', params => {
    socket.join(params.room.toString());
  });

  socket.on('new_message_send', (params, callback) => {
    const newMessageData = {
      content: params.message.content,
      sended_by: params.message.sended_by,
      read: false,
      createdAt: moment(Date.now()).tz("Europe/Istanbul").format("HH[:]mm A [/] DD[.]MM[.]YYYY")
    };

    if (io.sockets.clients().adapter.rooms[params.to].length > 1) {
      newMessageData.read = true;

      Chat.findByIdAndUpdate(mongoose.Types.ObjectId(params.to), {
        $push: {
          "messages": newMessageData
        }
      }, {upsert: true}, err => {
        if (err) return callback(err);

        socket.to(params.to).emit('new_message', {message: newMessageData});
        return callback(undefined, newMessageData);
      });
    } else {
      Chat.findByIdAndUpdate(mongoose.Types.ObjectId(params.to), {
        $push: {
          "messages": newMessageData
        }
      }, {upsert: true}, err => {
        if (err) return callback(err);

        socket.to(params.to).emit('new_message', {message: newMessageData});
        return callback(undefined, newMessageData);
      });
    };
  });
};
