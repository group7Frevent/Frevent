const db = require("../database");

const eventDetails = {
    getEventDetails: function (userID, callback) {
        return db.query("SELECT eventname AS Tapahtuma, description AS Kuvaus, location AS Paikka, startdate AS Ajankohta FROM events UNION SELECT eventname AS Tapahtuma, description AS Kuvaus, location AS Paikka, date AS Ajankohta FROM userEvents LEFT JOIN invitations ON userEvents.IDUserEvents=invitations.IDEvent WHERE invitations.IDUser = ? ORDER BY Ajankohta;", [userID], callback);
    },

    getAttendees: function (eventID, callback) {
        return db.query("SELECT COUNT(IDUser) AS Attendees FROM userAndUserEvents WHERE IDEvent = ?", [eventID], callback);  //Tähän tehtävä vielä toinen kysely laskemaan myös yritystapahtumien osallistujia
    },
};

module.exports = eventDetails;
