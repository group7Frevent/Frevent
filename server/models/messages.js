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
        return db.query("SELECT message, timestamp, seen FROM messages WHERE ID = ?;",
            [ID], callback)
    },
    getHowManyUnRead: function (senderID, toID, callback) {
        return db.query("SELECT COUNT(ID) AS unread FROM messages where senderID=? AND toID=? and seen=0;",
            [senderID, toID], callback)
    },
    setMessagesSeen: function (senderID, toID, callback) {
        return db.query("UPDATE messages SET seen=1 WHERE senderID=? AND toID=?;",
            [senderID, toID], callback)
    }
};

module.exports = messageController;
