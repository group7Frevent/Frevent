var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
var users = require("../models/users")
var errors = require("../errors")
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// update user username and password by id
router.put('/update/user/', function (req, res, next) {
    if (req.body.username && req.body.password && req.body.ID) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            console.log("here")
            users.updateUser(req.body, hash, (dberr, dbRes) => {
                if (dberr) {
                    errors.errorCode(dberr, res)
                } else {
                    users.getUserData(req.body.username, (dberr, dbResult) => {
                        if (dberr) {
                            // If error return error
                            errors.errorCode(dberr, res)
                        } else {
                            // Return company details and json web token
                            // Get json web token
                            const token = generateAccessToken({ userData: dbResult[0] });
                            dbResult[0].token = token
                            // Delete password field
                            delete dbResult[0].password
                            // Return
                            res.send(dbResult[0])
                        }
                    })
                }
            })
        })
    } else {
        errors.errorCode("missing params", res)
    }
});

router.put('/update/userpicture/', function (req, res, next) {
    if (req.body.picture) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        const encodedToken = parseJwt(token)
        const id = encodedToken.userData.ID
        const userName = encodedToken.userData.username
        users.updateUserPicture(id, req.body.picture, (dberr, dbRes) => {
                if (dberr) {
                    errors.errorCode(dberr, res)
                } else {
                    users.getUserData(userName, (dberr, dbResult) => {
                        if (dberr) {
                            // If error return error
                            errors.errorCode(dberr, res)
                        } else {
                            res.send(dbResult[0])
                        }
                    })
                }
            
        })
    } else {
        errors.errorCode("missing params", res)
    }
});

function parseJwt(token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

function generateAccessToken(userID) {
    dotenv.config();
    return jwt.sign(userID, process.env.MY_TOKEN, { expiresIn: '300d' });
}

module.exports = router;