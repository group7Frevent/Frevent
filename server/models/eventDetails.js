const db = require("../database");

const eventDetails = {
    getEventDetails: function (userID, callback) {
        return db.query("SELECT e.ID AS id, e.eventname AS Tapahtuma, e.description AS Kuvaus, e.location AS Paikka, e.startdate AS Ajankohta, (SELECT COUNT(IDUser) FROM usersAndEvents WHERE IDEvent=e.ID) AS Osallistujia, e.eventType as eventType FROM events e WHERE e.startdate > NOW() UNION SELECT ue.IDUserEvents AS id, ue.eventname AS Tapahtuma, ue.description AS Kuvaus, ue.location AS Paikka, ue.date AS Ajankohta, (SELECT COUNT(IDUser) FROM userAndUserEvents WHERE IDEvent=ue.IDUserEvents) AS Osallistujia, ue.eventType as eventType FROM userEvents ue LEFT JOIN invitations i ON ue.IDUserEvents=i.IDEvent WHERE i.IDUser = ? AND ue.date > NOW() ORDER BY Ajankohta;"
        , [userID], callback);
    },

};

module.exports = eventDetails;

