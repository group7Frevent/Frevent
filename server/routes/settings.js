var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
var users = require("../models/users")
var errors = require("../errors")
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
var company = require("../models/company")

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

router.put('/update/userpicture/', function (req, res, next) { // update user picture by id
    console.log(req.body.picture)
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    console.log(token)
    const encodedToken = parseJwt(token)
    console.log("here")
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
                    const token = generateAccessToken({ userData: dbResult[0] });
                    dbResult[0].token = token
                    // Delete password field
                    delete dbResult[0].password

                    res.send(dbResult[0])
                }
            })
        }

    })
});

router.put('/update/company/', function (req, res, next) { // update company username and password by id
    if (req.body.username && req.body.password && req.body.IDcompany) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            console.log("here")
            company.updateCompany(req.body, hash, (dberr, dbRes) => {
                if (dberr) {
                    errors.errorCode(dberr, res)
                } else {
                    company.getCompanyData(req.body.username, (dberr, dbResult) => {
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

router.put('/update/companypicture/', function (req, res, next) { // update company picture by id
    console.log(req.body.picture)
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    const encodedToken = parseJwt(token)
    const id = encodedToken.userData.IDcompany
    const userName = encodedToken.userData.username
    console.log("here")
    company.updateCompanyPicture(id, req.body.picture, (dberr, dbRes) => {
        if (dberr) {
            errors.errorCode(dberr, res)
        } else {
            console.log(dbRes)
            company.getCompanyData(userName, (dberr, dbResult) => {
                if (dberr) {
                    // If error return error
                    errors.errorCode(dberr, res)
                } else {
                    const token = generateAccessToken({ userData: dbResult[0] });
                    dbResult[0].token = token
                    // Delete password field
                    delete dbResult[0].password

                    res.send(dbResult[0])
                }
            })
        }

    })
});

function parseJwt(token) { // parse json web token
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

function generateAccessToken(userID) { // Generate token
    dotenv.config();
    return jwt.sign(userID, process.env.MY_TOKEN, { expiresIn: '300d' });
}



module.exports = router;