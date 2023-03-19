var clients = [];

exports = module.exports = function (io) {
    io.sockets.on('connection', function (socket) {

        socket.on('storeClientInfo', (data) => {
            console.log('storeClientInfo: ' + data?.customId);
            socket.join(data?.customId)
            var clientInfo = new Object();
            clientInfo.customId = data.customId;
            clientInfo.clientId = socket.id;
            clients.push(clientInfo);

        });

        socket.on("send_message", (data) => {
            console.log(data)
            socket.to(parseInt(data.sendTo)).emit("getMSG", data)

        })

        socket.on('disconnect', function (data) {
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