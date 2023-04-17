var clients = [];
var messageController = require('../models/messages')
var moment = require('moment-timezone');

exports = module.exports = function (io) {
    // Create connection to Socket.io
    io.sockets.on('connection', function (socket) {
        //console.log(socket)
        socket.on('storeClientInfo', (data) => {
            console.log('storeClientInfo: ' + data?.customId);
            socket.join(data?.customId)
            var clientInfo = new Object();
            clientInfo.customId = data.customId;
            clientInfo.clientId = socket.id;
            clients.push(clientInfo);

        });

        socket.on("send_message", (data) => {
            data.timestamp = moment().tz("Europe/Helsinki").format();


            messageController.addMessage(data, (dberr, dbres) => {
                if (dberr) {

                } else {
                    if (dbres.affectedRows == 1) {
                        messageController.getMessagesBySenderIDAndToID(data.senderID, data.toID, (dbErr, dbRes) => {
                            if (dbErr) {

                            } else {
                                socket.to(parseInt(data.toID)).emit("getMSG", dbRes)
                                socket.to(parseInt(data.senderID)).emit("getMSG", dbRes)
                                console.log("Here")
                            }
                        })

                    }
                }
            })

        })

        socket.on('disconnect', function (data) {
            console.log("User disconnected")
            for (var i = 0, len = clients.length; i < len; ++i) {
                var c = clients[i];
                if (c.clientId == socket.id) {
                    clients.splice(i, 1);
                    break;
                }
            }
        });

    });
}
