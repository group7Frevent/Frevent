const db = require("../database");

const users = {
    // MySQL queries for users authentication

    getUserData: function (user, callback) { // MySQL query for getting user data
        return db.query("select * from users where username=?", [user], callback);
    },
    getUserDataByID: function (ID, callback) { // MySQL query for getting user data by ID
        return db.query("select * from users where ID=?", [ID], callback);
    },
    addUser: function (body, date, hash, callback) { // MySQL query for adding user
        return db.query("INSERT INTO users (username, fname, lname, birthdate, picture, password, email) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [body.username, body.fname, body.lname, date, body.picture, hash, body.email], callback)
    },
    updateUser: function (body, hash, callback) { // MySQL query for updating user
        return db.query("UPDATE users SET username=?, password=? where ID=?",
            [body.username, hash, body.ID], callback)

    },
    updateUserPicture: function (ID, picture, callback) { // MySQL query for updating user picture
        return db.query("UPDATE users SET picture=? where ID=?",
            [picture, ID], callback)
    }




};

module.exports = users;
