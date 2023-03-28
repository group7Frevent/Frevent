const db = require("../database");

const eventDetails = {
    getEventDetails: function (userID, callback) {
        return db.query("SELECT e.eventname AS Tapahtuma, e.description AS Kuvaus, e.location AS Paikka, e.startdate AS Ajankohta, (SELECT COUNT(IDUser) FROM usersAndEvents WHERE IDEvent=e.ID) AS Osallistujia FROM events e UNION SELECT ue.eventname AS Tapahtuma, ue.description AS Kuvaus, ue.location AS Paikka, ue.date AS Ajankohta, (SELECT COUNT(IDUser) FROM userAndUserEvents WHERE IDEvent=ue.IDUserEvents) AS Osallistujia FROM userEvents ue LEFT JOIN invitations i ON ue.IDUserEvents=i.IDEvent WHERE i.IDUser = ? ORDER BY Ajankohta;", [userID], callback);
    },

};

module.exports = eventDetails;
