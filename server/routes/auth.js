var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
var users = require("../models/users")
var company = require("../models/company")
var errors = require("../errors")
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');


// Login route
router.post('/login', function (req, res, next) {
    if (req.body.username && req.body.password && req.body.accountType) {
        console.log(`${req.body.username} ${req.body.password} ${req.body.accountType}`)
        if (req.body.accountType == "user") {
            // If account type is user execute this
            userLogin(req.body.username, req.body.password, res)
        } else if (req.body.accountType == "company") {
            // If account type is company execute this
            companyLogin(req.body.username, req.body.password, res)
        }
    }
});


// Function to login with normal account
const userLogin = (username, password, res) => {
    // Get account details
    users.getUserData(username, (dberr, dbres) => {
        if (dberr) {
            // If error return database error
            errors.errorCode(dberr, res)
        } else {
            if (dbres[0]) {
                // Username correct
                bcrypt.compare(password, dbres[0].password, (err, compareResult) => {
                    if (compareResult) {
                        // password matches, returning user details
                        // Get json web token
                        const token = generateAccessToken({ userData: dbres[0] });
                        dbres[0].token = token
                        // Delete password field
                        delete dbres[0].password
                        // Return
                        res.send(dbres[0])
                    } else {
                        // wrong password
                        errors.errorCode("wrong password", res)
                    }

                })
            } else {
                // wrong username
                errors.errorCode("wrong username", res)

            }
        }

    })
}


// Function to login with normal account
const companyLogin = (username, password, res) => {
    // Get account details
    company.getCompanyData(username, (dberr, dbres) => {
        if (dberr) {
            // If error return database error
            errors.errorCode(dberr, res)
        } else {
            if (dbres[0]) {
                // Username correct
                bcrypt.compare(password, dbres[0].password, (err, compareResult) => {
                    if (compareResult) {
                        // password matches, returning user details
                        // Get json web token
                        const token = generateAccessToken({ userData: dbres[0] });
                        dbres[0].token = token
                        // Delete password field
                        delete dbres[0].password
                        // Return
                        res.send(dbres[0])
                    } else {
                        // wrong password
                        errors.errorCode("wrong password", res)
                    }

                })
            } else {
                // wrong username
                errors.errorCode("wrong username", res)

            }
        }

    })
}



// Register new user
router.post('/register/user', function (req, res, next) {
    console.log("here")
    if (req.body.username && req.body.fname
        && req.body.lname && req.body.password
        && req.body.picture && req.body.birthdate && req.body.email) {
            
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            var date = new Date(req.body.birthdate)
            users.addUser(req.body, date, hash, (dberr, dbRes) => {
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
                            console.log(dbResult)
                            res.send(dbResult)
                        }
                    })
                }

            })


        })
    } else {
        errors.errorCode("missing params", res)
    }

});

// Register new company
router.post('/register/company', function (req, res, next) {
    // Check all params exist
    if (req.body.username && req.body.password
        && req.body.picture && req.body.companyname && req.body.email) {
        // bcrypt password
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            // If hash succeed lets add company to mysql
            company.addCompany(req.body, hash, (dberr, dbRes) => {
                if (dberr) {
                    // If error return error
                    errors.errorCode(dberr, res)
                } else {
                    // Get company details
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





// Generate token
function generateAccessToken(userID) {
    dotenv.config();
    return jwt.sign(userID, process.env.MY_TOKEN, { expiresIn: '300d' });
}


module.exports = router;
