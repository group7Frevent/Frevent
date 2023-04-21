var express = require('express');
var router = express.Router();
var eventDetails = require("../models/eventDetails")
var errors = require("../errors")
const fetch = require("node-fetch");


router.get('/getevents/', async (req, res) => {

    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        const encodedToken = parseJwt(token)

        eventDetails.getEventDetails(encodedToken.userData.ID, async (dbError, dbresult) => {                                       //Router to get event details and google locations
            if (dbresult) {
                const tempArray = dbresult
                res.send(tempArray)
            }
            else {
                res.send(dbError)
            }
        })
    } catch (error) {
        errors.errorCode(error, res)
    }

})


router.get('/getAttending/', async (req, res) => {

    try {

        const authHeader = req.headers['authorization']                                                     //Router to get users attendance on upcoming events
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
        errors.errorCode(error, res)
    }

})

router.post('/postAttendance/', async (req, res) => {

    try {

        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        const encodedToken = parseJwt(token)                                                                                //Router for user to attend an event

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
        const token = authHeader && authHeader.split(' ')[1]                                                                    //Router for user to cancel attendance to an event
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
        req.body.eventLocation &&                                                                                                           //Router to create an event
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
            errors.errorCode(error, res)
        }
    }
    else {
        errors.errorCode("wrong params", res)
    }
})


router.post('/postCompanyEvent/', async (req, res) => {                                                                  //Router to create an event for a company
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
            console.log(req.body)
            console.log("here")
            eventDetails.createCompanyEvent(req.body, encodedToken.userData.IDcompany,
                (dbError, dbresult) => {
                    console.log("here2")
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
    }
    else {
        errors.errorCode("wrong params", res)
    }
})

router.get('/myevents/', async (req, res) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]                                                                //Router to get users events
        const encodedToken = parseJwt(token)

        eventDetails.getMyEvents(encodedToken.userData.ID, async (dbError, dbresult) => {
            if (dbresult) {
                const tempArray = dbresult


                res.send(tempArray)
            }
            else {
                res.send(dbError)
            }
        })
    } catch (error) {
        errors.errorCode(error, res)
    }
})


router.get('/myevents/company', async (req, res) => {       //Router to get company events
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        const encodedToken = parseJwt(token)

        eventDetails.getMyEventsCompany(encodedToken.userData.IDcompany, async (dbError, dbresult) => {
            if (dbresult) {
                const tempArray = dbresult

                res.send(tempArray)
            }
            else {
                res.send(dbError)
            }
        })
    } catch (error) {
        errors.errorCode(error, res)
    }
})


router.get('/getAttendees/:eventID', async (req, res) => {  //Router to get attendees of an event
    try {
        if (req.params.eventID) {

            eventDetails.getAttendees(req.params.eventID, (dbError, dbresult) => {
                if (dbresult) {
                    res.send(dbresult)
                }
                else {
                    res.send(dbError)
                }
            })
        }

    } catch (error) {
        errors.errorCode(error, res)
    }
})

router.get('/getAttendees/company/:eventID', async (req, res) => { //Router to get attendees of an event (company)
    try {
        if (req.params.eventID) {

            eventDetails.getAttendeesCompany(req.params.eventID, (dbError, dbresult) => {
                if (dbresult) {
                    res.send(dbresult)
                }
                else {
                    res.send(dbError)
                }
            })
        }

    } catch (error) {
        errors.errorCode(error, res)
    }
})

router.delete('/deleteEvent/:eventID', async (req, res) => {    //Router to delete an event
    try {


        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        const encodedToken = parseJwt(token)

        // If the user is a normal user
        if (encodedToken.userData.ID) {

            if (req.params.eventID && encodedToken.userData.ID) {
                eventDetails.deleteEvent(req.params.eventID, encodedToken.userData.ID, (dbError, dbresult) => {
                    if (dbresult) {
                        res.send("Event deleted")
                    }
                    else {
                        res.send(dbError)
                    }
                })
            }
        }

        // If the user is a company
        if (encodedToken.userData.IDcompany) {

            if (req.params.eventID && encodedToken.userData.IDcompany) {
                eventDetails.deleteEventCompany(req.params.eventID, encodedToken.userData.IDcompany, (dbError, dbresult) => {
                    if (dbresult) {
                        res.send("Event deleted")
                    }
                    else {
                        res.send(dbError)
                    }
                })
            }
        }

    } catch (error) {
        errors.errorCode(error, res)
    }
})



function parseJwt(token) {  //Function to parse the JWT token
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}


module.exports = router;