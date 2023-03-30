const db = require("../database");

const friends = {
    getFriends: (userID, callback) => {
        return db.query("SELECT friendID FROM friends WHERE userID = ? AND status='confirmed' UNION SELECT userID FROM friends WHERE friendID = ?",
            [userID, userID], callback)
    },
    getFirendsAndData: (userID, callback) => {
        return db.query("SELECT ID, username, fname, lname, birthdate ,picture, email FROM users u where u.id in (SELECT friendID FROM friends WHERE userID = ? AND status='confirmed' UNION SELECT userID FROM friends WHERE friendID = ?);",
            [userID, userID], callback)
    },
    getAvailableUsersAndData: (userID, callback) => {
        return db.query("SELECT ID, username, fname, lname, birthdate ,picture, email FROM users u where u.id not in (SELECT friendID FROM friends WHERE userID = ? AND status='confirmed' UNION SELECT userID FROM friends WHERE friendID = ?  AND status='confirmed');",
            [userID, userID], callback)
    },
    getFriendStatus: (userID, friendID, callback) => {
        return db.query("SELECT status FROM friends WHERE (userID = ? or friendID = ? ) AND (userID = ? or friendID = ? )",
            [userID, userID, friendID, friendID], callback)
    },
    addFriend: (userID, friendID, callback) => {
        return db.query("INSERT INTO friends (userID, friendID, status) VALUES (?, ?, 'pending')",
            [userID, friendID], callback)
    },
    acceptFriend: (userID, friendID, callback) => {
        return db.query("UPDATE friends SET status = 'confirmed' WHERE (userID = ? or friendID = ? ) AND (userID = ? or friendID = ? )",
            [userID, userID, friendID, friendID], callback)
    },
    getPendingRequests: (userID, callback) => {
        return db.query("SELECT ID, username, fname, lname, birthdate ,picture, email FROM users u where u.id in (SELECT userID FROM friends WHERE friendID = ? AND status='pending');",
            [userID], callback)
    }
}

module.exports = friends;