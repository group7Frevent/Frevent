const db = require("../database");

const users = {
    getUserData: function (user, callback) {
        return db.query("select * from users where username=?", [user], callback);
    },
    getUserDataByID: function (ID, callback) {
        return db.query("select * from users where ID=?", [ID], callback);
    },
    addUser: function (body, date, hash, callback) {
        return db.query("INSERT INTO users (username, fname, lname, birthdate, picture, password, email) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [body.username, body.fname, body.lname, date, body.picture, hash, body.email], callback)
    },
    updateUser: function (body, hash, callback) {
        return db.query("UPDATE users SET username=?, password=? where ID=?",
            [body.username, hash, body.ID], callback)

    },
    updateUserPicture: function (ID, picture, callback) {
        return db.query("UPDATE users SET picture=? where ID=?",
            [picture, ID], callback)

    }
    


    
};

module.exports = users;
