var express = require('express');
var router = express.Router();
var eventDetails = require("../models/eventDetails")
var errors = require("../errors")

router.get('/getevents/', async (req, res) => {

    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        const encodedToken = parseJwt(token)

        eventDetails.getEventDetails(encodedToken.userData.ID, (dbError, dbresult) => {
            if (dbresult) {
                res.send(dbresult)
            }
            else {
                res.send(dbError)
            }
        })
    } catch (error) {
        errors.errorCode(error)
    }

})

router.get('/getAttending/', async (req, res) => {

    try {

        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        const encodedToken = parseJwt(token)

        eventDetails.getAttending(encodedToken.userData.ID, (dbError, dbresult) => {
            if (dbresult) {
                res.send(dbresult)
            }
            else {
                res.send(dbError)
            }
        })
    } catch (error) {
        errors.errorCode(error)
    }

})

router.post('/postAttendance/', async (req, res) => {

    try {

        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        const encodedToken = parseJwt(token)

        eventDetails.attendEvent(encodedToken.userData.ID, req.body.IDEvent, req.body.eventType, (dbError, dbresult) => {
            if (dbresult) {
                res.send(dbresult)
            }
            else {
                res.send(dbError)
            }
        })
    } catch (error) {
        errors.errorCode(error, res)
    }

})

router.delete('/deleteAttendance/', async (req, res) => {

    try {

        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        const encodedToken = parseJwt(token)

        eventDetails.deleteAttendance(encodedToken.userData.ID, req.body.IDEvent, req.body.eventType, (dbError, dbresult) => {
            if (dbresult) {
                res.send(dbresult)
            }
            else {
                res.send(dbError)
            }
        })
    } catch (error) {
        errors.errorCode(error, res)
    }

})

router.post('/postUserEvent/', async (req, res) => {
    if (
        req.body.eventName &&
        req.body.eventDate &&
        req.body.eventLocation &&
        req.body.eventDescription &&
        req.body.eventType
    ) {
        try {

            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]
            const encodedToken = parseJwt(token)

            eventDetails.createUserEvent(
                req.body.eventName,
                req.body.eventDescription,
                req.body.eventLocation,
                req.body.eventDate,
                req.body.eventType,
                encodedToken.userData.ID,
                (dbError, dbresult) => {
                    if (dbresult) {
                        if (req.body?.invites) {

                            const invites = JSON.parse(req.body.invites)
                            console.log(invites)
                            invites.forEach(element => {
                                eventDetails.inviteUserToEvent(
                                    dbresult.insertId,
                                    element,
                                    (dbError, dbresult) => {
                                        if (dbresult) {
                                            console.log("Invited")
                                        }
                                        else {
                                            res.send(dbError)
                                        }
                                    })
                            });
                        }
                        res.send(dbresult)
                    }
                    else {
                        res.send(dbError)
                    }
                })
        } catch (error) {
            errors.errorCode(error)
        }
    }
    else {
        errors.errorCode("wrong params", res)
    }
})



function parseJwt(token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}


module.exports = router;