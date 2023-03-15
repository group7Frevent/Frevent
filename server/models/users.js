const db = require("../database");

const users = {
    getUserData: function (user, callback) {
        return db.query("select * from users where username=?", [user], callback);
    },
    addUser: function (body, date, hash, callback) {
        return db.query("INSERT INTO users (username, fname, lname, birthdate, password, picture) VALUES (?, ?, ?, ?, ?, ?)",
            [body.username, body.fname, body.lname, date, hash, body.picture], callback)
    }
};

module.exports = users;
