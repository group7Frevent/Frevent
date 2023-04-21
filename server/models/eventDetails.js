const db = require("../database");

const eventDetails = {
    // MySQL queries for events

    getEventDetails: function (userID, callback) {          //SQL query to fetch events that the current user should see on their front page
        return db.query("SELECT e.ID AS id, e.eventname AS Tapahtuma, e.description AS Kuvaus, e.location AS Paikka, e.startdate AS Ajankohta, (SELECT COUNT(IDUser) FROM usersAndEvents WHERE IDEvent=e.ID) AS Osallistujia, e.eventType as eventType, c.companyname AS Organizer, c.picture AS ProfilePic FROM events e INNER JOIN company c ON c.IDcompany = e.companyID WHERE e.startdate > NOW() UNION SELECT ue.IDUserEvents AS id, ue.eventname AS Tapahtuma, ue.description AS Kuvaus, ue.location AS Paikka, ue.date AS Ajankohta, (SELECT COUNT(IDUser) FROM userAndUserEvents WHERE IDEvent=ue.IDUserEvents) AS Osallistujia, ue.eventType as eventType, CONCAT(u.fname, ' ', u.lname) AS Organizer, u.picture AS ProfilePic FROM userEvents ue LEFT JOIN invitations i ON ue.IDUserEvents=i.IDEvent LEFT JOIN users u ON u.ID = ue.ownerID WHERE i.IDUser = ? AND ue.date > NOW() ORDER BY Ajankohta;"
            , [userID], callback);
    },

    getAttending: function (userID, callback) {       //SQL query to get users events that he is already attending to
        return db.query("SELECT uaue.IDEvent AS IDEvent, ue.eventType AS eventType FROM userAndUserEvents uaue LEFT JOIN userEvents ue ON uaue.IDEvent = ue.IDUserEvents WHERE IDUser = ? UNION SELECT uae.IDEvent AS IDEvent, e.eventType AS eventType FROM usersAndEvents uae LEFT JOIN events e ON uae.IDEvent = e.ID WHERE IDUser = ?"
            , [userID, userID], callback);
    },

    attendEvent: function (userID, IDEvent, eventType, callback) {       //SQL query to post event attendance
        if (eventType === 'com') {
            return db.query("INSERT INTO usersAndEvents (IDUser, IDEvent) VALUES (?,?)"
                , [userID, IDEvent], callback);
        }
        else {
            return db.query("INSERT INTO userAndUserEvents (IDUser, IDEvent) VALUES (?,?)"
                , [userID, IDEvent], callback);
        }
    },

    deleteAttendance: function (userID, IDEvent, eventType, callback) {        //SQL query to delete event attendance
        if (eventType === 'com') {
            return db.query("DELETE FROM usersAndEvents WHERE IDUser = ? AND IDEvent = ?"
                , [userID, IDEvent], callback);
        }
        else {
            return db.query("DELETE FROM userAndUserEvents WHERE IDUser = ? AND IDEvent = ?"
                , [userID, IDEvent], callback);
        }
    },
    createUserEvent: function (eventname, description, location, date, eventType, userID, callback) {       //SQL query to create event
        return db.query("INSERT INTO userEvents ( eventname, description, ownerID, location, date, eventType) VALUES (?,?,?,?,?,'cus')"
            , [eventname, description, userID, location, date], callback);
    },

    createCompanyEvent: function (requestbody, companyID, callback) { //SQL query to create company event
        return db.query("INSERT INTO events (eventname, description, companyID, location, startdate, eventType) VALUES (?, ?, ?, ?, ?, 'com')"
            , [requestbody.eventName, requestbody.eventDescription, companyID, requestbody.eventLocation, requestbody.eventDate], callback);
    },
    inviteUserToEvent: function (IDEvent, IDUser, callback) { //SQL query to invite user to event
        return db.query("INSERT INTO invitations (IDEvent, IDUser) VALUES (?,?)"
            , [IDEvent, IDUser], callback);
    },
    getMyEvents: function (userID, callback) { //SQL query to get my events, and count of attendees
        return db.query("SELECT IDUserEvents as ID, eventname ,description ,ownerID ,location, date , eventType, (SELECT COUNT(IDuserAndUserEvents) FROM userAndUserEvents WHERE IDEvent=IDUserEvents) as attendees FROM userEvents WHERE ownerID = ?"
            , [userID], callback);
    },
    getMyEventsCompany: function (companyID, callback) { //SQL query to get my company events, and count of attendees
        return db.query("SELECT ID, eventname ,description ,companyID as ownerID ,location, startdate as date , eventType, (SELECT COUNT(IDUsersAndEvents) FROM usersAndEvents WHERE IDEvent=ID) as attendees FROM events WHERE companyID = ?"
            , [companyID], callback);
    },
    getAttendees: function (IDEvent, callback) { //SQL query to get attendees of event
        return db.query("SELECT users.ID, users.username, users.fname, users.lname, users.birthdate, users.picture, users.email FROM users INNER JOIN userAndUserEvents ON userAndUserEvents.IDUser=users.ID WHERE IDEvent=?;"
            , [IDEvent], callback);
    },
    getAttendeesCompany: function (IDEvent, callback) { //SQL query to get attendees of company event
        return db.query("SELECT users.ID, users.username, users.fname, users.lname, users.birthdate, users.picture, users.email FROM users INNER JOIN usersAndEvents ON usersAndEvents.IDUser=users.ID WHERE IDEvent=?"
            , [IDEvent], callback);
    },
    deleteEvent: function (IDEvent, ownerID, callback) { //SQL query to delete event
        return db.query("CALL deleteEvent(?, ?);"
            , [IDEvent, ownerID], callback);
    },
    deleteEventCompany: function (IDEvent, ownerID, callback) { //SQL query to delete company event
        return db.query("CALL deleteEventComp(?, ?);"
            , [IDEvent, ownerID], callback);
    }
};



module.exports = eventDetails;

