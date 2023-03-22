const db = require("../database");

const company = {
    getCompanyData: function (username, callback) {
        return db.query("select * from company where username=?", [username], callback);
    },
    addCompany: function (body, hash, callback) {
        return db.query("INSERT INTO company (username, password, companyname, picture, email) VALUES (?, ?, ?, ?, ?)",
            [body.username, hash, body.companyname, body.picture, body.email], callback)
    }
};

module.exports = company;
