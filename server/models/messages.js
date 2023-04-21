const db = require("../database");

const messageController = {
    // MySQL queries for messages

    addMessage: function (message, callback) { // MySQL query for adding message
        return db.query("INSERT INTO messages (senderID, toID, timestamp, message, seen) VALUES (?, ?, ?, ?, 0);",
            [message.senderID, message.toID, message.timestamp, message.message], callback);
    },
    getMessagesBySenderIDAndToID: function (senderID, toID, callback) { // MySQL query for getting messages by senderID and toID
        return db.query("SELECT * FROM messages WHERE (senderID = ? or senderID = ?) AND (toID = ? or toID = ?) order by timestamp",
            [senderID, toID, senderID, toID], callback)
    },
    getLatestMessageID: function (senderID, toID, callback) { // MySQL query for getting latest message ID
        return db.query("SELECT MAX(ID) as ID FROM messages WHERE (senderID = ? or senderID = ?) AND (toID = ? or toID = ?)",
            [senderID, toID, senderID, toID], callback)
    },
    getLatestMessageByID: function (ID, callback) { // MySQL query for getting latest message by ID
        return db.query("SELECT message, timestamp, seen FROM messages WHERE ID = ? ;",
            [ID], callback)
    },
    getHowManyUnRead: function (senderID, toID, callback) { // MySQL query for getting how many unread messages
        return db.query("SELECT COUNT(ID) AS unread FROM messages where senderID=? AND toID=? and seen=0;",
            [senderID, toID], callback)
    },
    setMessagesSeen: function (senderID, toID, callback) { // MySQL query for setting messages seen
        return db.query("UPDATE messages SET seen=1 WHERE senderID=? AND toID=?;",
            [senderID, toID], callback)
    }
};

module.exports = messageController;
