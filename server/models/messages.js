const db = require("../database");

const messageController = {
    addMessage: function (message, callback) {
        return db.query("INSERT INTO messages (senderID, toID, timestamp, message, seen) VALUES (?, ?, ?, ?, 0);",
            [message.senderID, message.toID, message.timestamp, message.message], callback);
    },
    getMessagesBySenderIDAndToID: function (senderID, toID, callback) {
        return db.query("SELECT * FROM messages WHERE (senderID = ? or senderID = ?) AND (toID = ? or toID = ?)",
            [senderID, toID, senderID, toID], callback)
    },
    getLatestMessageID: function (senderID, toID, callback) {
        return db.query("SELECT MAX(ID) as ID FROM messages WHERE (senderID = ? or senderID = ?) AND (toID = ? or toID = ?)",
            [senderID, toID, senderID, toID], callback)
    },
    getLatestMessageByID: function (ID, callback) {
        return db.query("SELECT message, timestamp FROM messages WHERE ID = ?;",
            [ID], callback)
    }
};

module.exports = messageController;
