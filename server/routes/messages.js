var express = require('express');
var router = express.Router();
var errors = require("../errors")
var messageController = require('../models/messages')

router.post("/send", function (req, res, next) {
    if (req.body.senderID && req.body.toID && req.body.timestamp && req.body.message) {
        messageController.addMessage(req.body, (dberr, dbRes) => {
            if (dberr) {
                errors.errorCode(dberr, res)
            } else {
                res.send(true)
            }
        })
    }
});

router.get("/getmsg/:senderID/:toID", function (req, res, next) {

    if (req.params.senderID && req.params.toID) {
        // Get bearer token and encode it to check userID
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        const encodedToken = parseJwt(token)

        if (encodedToken.userData.ID == req.params.senderID) {

            messageController.getMessagesBySenderIDAndToID(req.params.senderID, req.params.toID, (dberr, dbRes) => {
                if (dberr) {
                    errors.errorCode(dberr, res)
                } else {
                    res.send(dbRes)
                }
            })
        } else {
            errors.errorCode("wrong senderID", res)
        }
    }
})


function parseJwt(token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

module.exports = router;