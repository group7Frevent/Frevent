const db = require("../database");

const company = {
    // MySQL queries for company settings
    getCompanyData: function (username, callback) { // MySQL query for getting company data
        return db.query("select * from company where username=?", [username], callback);
    },
    addCompany: function (body, hash, callback) { // MySQL query for adding company
        return db.query("INSERT INTO company (username, password, companyname, picture, email) VALUES (?, ?, ?, ?, ?)",
            [body.username, hash, body.companyname, body.picture, body.email], callback)
    },
    updateCompany: function (body, hash, callback) { // MySQL query for updating company
        return db.query("UPDATE company SET username=?, password=? where IDcompany=?",
            [body.username, hash, body.IDcompany], callback)
    },
    updateCompanyPicture: function (ID, picture, callback) { // MySQL query for updating company picture
        return db.query("UPDATE company SET picture=? where IDcompany=?",
            [picture, ID], callback)
    }
};

module.exports = company;
