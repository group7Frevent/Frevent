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

function generateAccessToken(userID) {
    dotenv.config();
    return jwt.sign(userID, process.env.MY_TOKEN, { expiresIn: '300d' });
}

module.exports = router;