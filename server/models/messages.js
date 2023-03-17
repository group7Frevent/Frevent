const db = require("../database");

const messageController = {
    addMessage: function (message, callback) {
        return db.query("INSERT INTO messages (senderID, toID, timestamp, message) VALUES (?, ?, ?, ?);",
            [message.senderID, message.toID, message.timestamp, message.message], callback);
    },
    getMessagesBySenderIDAndToID: function (senderID, toID, callback) {
        return db.query("SELECT * FROM messages WHERE (senderID = ? or senderID = ?) AND (toID = ? or toID = ?)",
            [senderID, toID, senderID, toID], callback)
    }
};

module.exports = messageController;
