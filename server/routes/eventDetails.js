var express = require('express');
var router = express.Router();
var eventDetails = require("../models/eventDetails")
var errors = require("../errors")

router.get('/getevents/',async (req, res) => {

    try {
        
        // Added extra middleware
        // Get bearer token and encode it to check userID
        const authHeader = req.headers['authorization']
        //console.log(authHeader)
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

function parseJwt(token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}


module.exports = router;