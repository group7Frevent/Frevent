const db = require("../database");

const friends = {
    // MySQL queries for friends
    getFriends: (userID, callback) => { // MySQL query for getting friends
        return db.query("SELECT friendID FROM friends WHERE userID = ? AND status='confirmed' UNION SELECT userID FROM friends WHERE friendID = ? AND status='confirmed'",
            [userID, userID], callback)
    },
    getFirendsAndData: (userID, callback) => { // MySQL query for getting friends and data
        return db.query("SELECT ID, username, fname, lname, birthdate ,picture, email FROM users u where u.id in (SELECT friendID FROM friends WHERE userID = ? AND status='confirmed' UNION SELECT userID FROM friends WHERE friendID = ? AND status='confirmed');",
            [userID, userID], callback)
    },
    getAvailableUsersAndData: (userID, callback) => {   // MySQL query for getting available users and data
        return db.query("SELECT ID, username, fname, lname, birthdate ,picture, email FROM users u where u.id not in (SELECT friendID FROM friends WHERE userID = ? AND status='confirmed' UNION SELECT userID FROM friends WHERE friendID = ?  AND status='confirmed');",
            [userID, userID], callback)
    },
    getFriendStatus: (userID, friendID, callback) => { // MySQL query for getting friend status
        return db.query("SELECT status FROM friends WHERE (userID = ? or friendID = ? ) AND (userID = ? or friendID = ? )",
            [userID, userID, friendID, friendID], callback)
    },
    addFriend: (userID, friendID, callback) => { // MySQL query for adding friend
        return db.query("INSERT INTO friends (userID, friendID, status) VALUES (?, ?, 'pending')",
            [userID, friendID], callback)
    },
    acceptFriend: (userID, friendID, callback) => { // MySQL query for accepting friend request
        return db.query("UPDATE friends SET status = 'confirmed' WHERE (userID = ? or friendID = ? ) AND (userID = ? or friendID = ? )",
            [userID, userID, friendID, friendID], callback)
    },
    getPendingRequests: (userID, callback) => { // MySQL query for getting pending requests
        return db.query("SELECT ID, username, fname, lname, birthdate ,picture, email FROM users u where u.id in (SELECT userID FROM friends WHERE friendID = ? AND status='pending');",
            [userID], callback)
    },
    removeFriend: (userID, friendID, callback) => { // MySQL query for removing friend
        return db.query("DELETE FROM friends WHERE (userID = ? or friendID = ? ) AND (userID = ? or friendID = ? )",
            [userID, userID, friendID, friendID], callback)
    }
}

module.exports = friends;