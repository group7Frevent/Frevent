const db = require("../database");

const users = {
    getUserData: function (user, callback) {
        return db.query("select * from users where username=?", [user], callback);
    },
    getUserDataByID: function (ID, callback) {
        return db.query("select * from users where ID=?", [ID], callback);
    },
    addUser: function (body, date, hash, callback) {
        return db.query("INSERT INTO users (username, fname, lname, birthdate, password, picture) VALUES (?, ?, ?, ?, ?, ?)",
            [body.username, body.fname, body.lname, date, hash, body.picture], callback)
    },
    updateUser: function (body, hash, callback) {
        return db.query("UPDATE users SET username=?, password=? where ID=?",
            [body.username, hash, body.ID], callback)
    }
};

module.exports = users;
