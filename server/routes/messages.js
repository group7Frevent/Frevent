var express = require('express');
var router = express.Router();
var errors = require("../errors")
var messageController = require('../models/messages')
var friends = require('../models/friends');
const users = require('../models/users');


// Send msg
// Requires sender ID, to ID and message.
router.post("/send", function (req, res, next) {
    if (req.body.senderID && req.body.toID && req.body.timestamp && req.body.message) {
        messageController.addMessage(req.body, (dberr, dbRes) => {
            if (dberr) {
                errors.errorCode(dberr, res)
            } else {
                // Return true if not mysql errors
                res.send(true)
            }
        })
    }
});

// Get hole conversation between two ID's
router.get("/getmsg/:senderID/:toID", function (req, res, next) {
    if (req.params.senderID && req.params.toID) {
        // Added extra middleware
        // Get bearer token and encode it to check userID
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        const encodedToken = parseJwt(token)
        if (encodedToken.userData.ID == req.params.senderID) {
            // If true return conversation

            messageController.getMessagesBySenderIDAndToID(req.params.senderID, req.params.toID, (dberr, dbRes) => {
                if (dberr) {
                    errors.errorCode(dberr, res)
                } else {
                    res.send(dbRes)
                }
            })
        } else {
            // If false return error
            errors.errorCode("wrong senderID", res)
        }
    }
})

router.get("/chats/:id", (req, res, next) => {
    if (req.params.id) {
        friends.getFriends(req.params.id, (dberr, dbRes) => {
            if (dberr) {
                errors.errorCode(dberr, res)
            } else {
                res.send(dbRes)
            }
        })
    }
})


// Get friends picture, last msg to you, date and username
router.get("/friends/:id", async (req, res, next) => {
    if (req.params.id) {
        // Lets get friends details
        getConversationsFun(req.params.id, req, res)
    }
})


const getConversationsFun = (senderID, req, res) => {
    friends.getFriends(senderID, async (dberr, dbRes) => {
        if (dberr) {
            errors.errorCode(dberr, res)
        } else {
            if (dbRes.length > 0) {

                var returnObj = []
                var filteredDbresult = []

                /////////////////////////////////
                // This function returns friend details by ID
                function getFriendData(ID) {
                    return new Promise((resolve, rejected) => {
                        users.getUserDataByID(ID, (dbError, dbResult) => {
                            if (dbError) rejected(dbError)
                            filteredDbresult = dbResult[0]

                            // Delete unnecessary field (password and birthdate)
                            delete filteredDbresult?.password
                            delete filteredDbresult?.birthdate
                            returnObj.push(filteredDbresult)
                            resolve(dbResult)
                        })
                    })
                }

                /////////////////////////////////
                // This function returns last msg and timestamp between you and your friend, param: ID is your friend ID
                function getLatestMessage(ID) {
                    return new Promise((resolve, rejected) => {
                        // First lets get latest msg ID
                        messageController.getLatestMessageID(senderID, ID, (dbError, dbResult) => {
                            if (dbError) rejected(dbError)
                            // Get msg and timestamp by msg ID
                            messageController.getLatestMessageByID(dbResult[0].ID, (dber, dbresult) => {
                                if (dber) rejected(dber)
                                var elementPos = returnObj.map((x => x.ID)).indexOf(ID);
                                // Push result to returnObj. returnObj is object that we want to return to client 
                                returnObj[elementPos].message = dbresult[0]?.message
                                returnObj[elementPos].timestamp = dbresult[0]?.timestamp
                                //returnObj[elementPos].unread = dbresult[0]?.seen
                                // How many messages unRead
                                console.log(dbresult[0]?.seen)
                                if (dbresult[0]?.seen == 0) {
                                    messageController.getHowManyUnRead(ID, senderID, (dbe, dbr) => {
                                        if (dber) rejected(dber)
                                        console.log("here")
                                        returnObj[elementPos].unread = dbr[0].unread
                                        resolve(dbresult)

                                    })
                                } else {
                                    returnObj[elementPos].unread = 0
                                    resolve(dbresult)
                                }

                            })
                        })
                    })
                }

                // Call getFriendData()
                for (let i = 0; i < dbRes.length; i++) {
                    await getFriendData(dbRes[i]?.friendID)
                }

                // Call getLatestMessage()
                for (let i = 0; i < returnObj.length; i++) {
                    await getLatestMessage(returnObj[i].ID)
                }

                res.send(returnObj)
            }
        }
    })
}


// Set all messages seen, params ID
router.put("/setSeen/:senderID/:toID", async (req, res, next) => {
    if (req.params.senderID && req.params.toID) {
        // Added extra middleware
        // Get bearer token and encode it to check userID
        const authHeader = req.headers['authorization']
        //console.log(authHeader)
        const token = authHeader && authHeader.split(' ')[1]
        const encodedToken = parseJwt(token)
        if (encodedToken.userData.ID == req.params.toID) {
            messageController.setMessagesSeen(req.params.senderID, req.params.toID, (dbErr, dbRes) => {
                if (dbErr) {
                    errors.errorCode(dbErr, res)
                } else {
                    getConversationsFun(req.params.senderID, req, res)
                }
            })
        } else {
            // If false return error
            errors.errorCode("wrong senderID", res)
        }


    }
})

// Function to extra middleware
function parseJwt(token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

module.exports = router;