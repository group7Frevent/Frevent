var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
var users = require("../models/users")
var errors = require("../errors")
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const friends = require('../models/friends');


router.get('/myfriends', async function (req, res, next) {
    try {

        // Added extra middleware
        // Get bearer token and encode it to check userID
        const authHeader = req.headers['authorization']
        //console.log(authHeader)
        const token = authHeader && authHeader.split(' ')[1]
        const encodedToken = parseJwt(token)
        friends.getFirendsAndData(encodedToken.userData.ID, (dbError, dbresult) => {
            if (dbresult) {
                res.send(dbresult)
            }
            else {
                errors.errorCode(dbError)
            }
        })
    } catch (error) {
        errors.errorCode(error)
    }
})

router.get('/notfriends', async function (req, res, next) {
    try {
        var returnObj = []
        // Added extra middleware
        // Get bearer token and encode it to check userID
        const authHeader = req.headers['authorization']
        //console.log(authHeader)
        const token = authHeader && authHeader.split(' ')[1]
        const encodedToken = parseJwt(token)
        friends.getAvailableUsersAndData(encodedToken.userData.ID, async (dbError, dbresult) => {
            if (dbresult) {
                //res.send(dbresult)
                var elementPos = dbresult.map((x => x.ID)).indexOf(encodedToken.userData.ID);
                //console.log(dbresult[elementPos])
                dbresult.splice(elementPos, 1)
                returnObj = dbresult

                function getStatusIfFriend(friendID) {
                    return new Promise((resolve, reject) => {
                        friends.getFriendStatus(encodedToken.userData.ID, friendID, (dbError, dbresult) => {
                            if (dbresult[0]?.status == "pending") {
                                var elementPosi = returnObj.map((x => x.ID)).indexOf(friendID);
                                console.log(dbresult[0]?.status)
                                console.log(friendID)
                                returnObj[elementPosi] = { ...returnObj[elementPosi], status: dbresult[0]?.status }
                                resolve(dbresult)
                            } else if (dbresult) {
                                resolve(dbresult)
                            } else {
                                reject(dbError)
                            }
                        })
                    })
                }

                for (let i = 0; i < returnObj.length; i++) {
                    await getStatusIfFriend(returnObj[i].ID)
                }
                res.send(returnObj)
            }
            else {
                errors.errorCode(dbError)
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