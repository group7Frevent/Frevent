const db = require("../database");

const eventDetails = {
    getEventDetails: function (userID, callback) {
        return db.query("SELECT e.ID AS id, e.eventname AS Tapahtuma, e.description AS Kuvaus, e.location AS Paikka, e.startdate AS Ajankohta, (SELECT COUNT(IDUser) FROM usersAndEvents WHERE IDEvent=e.ID) AS Osallistujia, e.eventType as eventType FROM events e WHERE e.startdate > NOW() UNION SELECT ue.IDUserEvents AS id, ue.eventname AS Tapahtuma, ue.description AS Kuvaus, ue.location AS Paikka, ue.date AS Ajankohta, (SELECT COUNT(IDUser) FROM userAndUserEvents WHERE IDEvent=ue.IDUserEvents) AS Osallistujia, ue.eventType as eventType FROM userEvents ue LEFT JOIN invitations i ON ue.IDUserEvents=i.IDEvent WHERE i.IDUser = ? AND ue.date > NOW() ORDER BY Ajankohta;"
            , [userID], callback);
    },

    getAttending: function (userID, callback) {
        return db.query("SELECT uaue.IDEvent AS IDEvent, ue.eventType AS eventType FROM userAndUserEvents uaue LEFT JOIN userEvents ue ON uaue.IDEvent = ue.IDUserEvents WHERE IDUser = ? UNION SELECT uae.IDEvent AS IDEvent, e.eventType AS eventType FROM usersAndEvents uae LEFT JOIN events e ON uae.IDEvent = e.ID WHERE IDUser = ?"
            , [userID, userID], callback);
    },

    attendEvent: function (userID, IDEvent, eventType, callback) {
        if (eventType === 'com') {
            return db.query("INSERT INTO usersAndEvents (IDUser, IDEvent) VALUES (?,?)"
                , [userID, IDEvent], callback);
        }
        else {
            return db.query("INSERT INTO userAndUserEvents (IDUser, IDEvent) VALUES (?,?)"
                , [userID, IDEvent], callback);
        }
    },

    deleteAttendance: function (userID, IDEvent, eventType, callback) {
        if (eventType === 'com') {
            return db.query("DELETE FROM usersAndEvents WHERE IDUser = ? AND IDEvent = ?"
                , [userID, IDEvent], callback);
        }
        else {
            return db.query("DELETE FROM userAndUserEvents WHERE IDUser = ? AND IDEvent = ?"
                , [userID, IDEvent], callback);
        }
    },
    createUserEvent: function (eventname, description, location, date, eventType, userID, callback) {
        return db.query("INSERT INTO userEvents ( eventname, description, ownerID, location, date, eventType) VALUES (?,?,?,?,?,'cus')"
            , [eventname, description, userID, location, date], callback);
    },
    inviteUserToEvent: function (IDEvent, IDUser, callback) {
        return db.query("INSERT INTO invitations (IDEvent, IDUser) VALUES (?,?)"
            , [IDEvent, IDUser], callback);
    },
    getMyEvents: function (userID, callback) {
        return db.query("SELECT * FROM userEvents WHERE ownerID = ?"
            , [userID], callback);
    }
};



module.exports = eventDetails;

