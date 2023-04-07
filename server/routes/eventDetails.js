var express = require('express');
var router = express.Router();
var eventDetails = require("../models/eventDetails")
var errors = require("../errors")

router.get('/getevents/',async (req, res) => {

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

router.get('/getAttending/',async (req, res) => {

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

router.post('/postAttendance/',async (req, res) => {

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
        errors.errorCode(error)
    }
    
})

router.delete('/deleteAttendance/',async (req, res) => {

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
        errors.errorCode(error)
    }
    
})

function parseJwt(token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}


module.exports = router;