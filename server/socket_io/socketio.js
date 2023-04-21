var clients = [];
var messageController = require('../models/messages')
var moment = require('moment-timezone');

// Socket.io, for real-time chat
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

        // Send message 
        socket.on("send_message", (data) => {
            // Get timestamp
            data.timestamp = moment().tz("Europe/Helsinki").format();

            // Add message to database
            messageController.addMessage(data, (dberr, dbres) => {
                if (dberr) {

                } else {
                    if (dbres.affectedRows == 1) {
                        messageController.getMessagesBySenderIDAndToID(data.senderID, data.toID, (dbErr, dbRes) => {
                            if (dbErr) {

                            } else {
                                // Send message to both users
                                socket.to(parseInt(data.toID)).emit("getMSG", dbRes)
                                socket.to(parseInt(data.senderID)).emit("getMSG", dbRes)
                                console.log("Here")
                            }
                        })

                    }
                }
            })

        })

        // disconnect
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
