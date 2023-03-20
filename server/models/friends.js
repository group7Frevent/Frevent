const db = require("../database");

const friends = {
    getFriends: (userID, callback) => {
        return db.query("SELECT friendID FROM friends WHERE userID = ? UNION SELECT userID FROM friends WHERE friendID = ?",
            [userID, userID], callback)
    }
}

module.exports = friends;