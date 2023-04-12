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

        eventDetails.getEventDetails(encodedToken.userData.ID, async (dbError, dbresult) => {
            if (dbresult) {
                const tempArray = dbresult


                const getGoogleLocations = async (placeID, index) => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const googleKey = process.env.GOOGLE_MAP_API_KEY
                            const googleUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeID}&key=${googleKey}`
                            const response = await fetch(googleUrl)
                            const data = await response.json()
                            tempArray[index].Paikka = data.result.formatted_address
                            tempArray[index].googleLocation = { lat: data.result.geometry.location.lat, lng: data.result.geometry.location.lng, url: data.result.url }
                            console.log(data)
                            resolve(data)
                        } catch (error) {
                            reject(error)
                        }

                    })
                } 



                for (let i = 0; i < tempArray.length; i++) {
                    await getGoogleLocations(tempArray[i].Paikka, i)
                }
                    
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

const getGoogleLocation = async (placeID) => {
    const googleKey = process.env.GOOGLE_MAP_API_KEY
    const googleUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeID}&fields=name,formatted_address&key=${googleKey}`
    const response = await fetch(googleUrl)
    const data = await response.json()
    return data
}

router.get('/getAttending/', async (req, res) => {

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

router.post('/postAttendance/', async (req, res) => {

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
        errors.errorCode(error, res)
    }

})

router.delete('/deleteAttendance/', async (req, res) => {

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
        errors.errorCode(error, res)
    }

})

router.post('/postUserEvent/', async (req, res) => {
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
            errors.errorCode(error)
        }
    }
    else {
        errors.errorCode("wrong params", res)
    }
})



function parseJwt(token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}


module.exports = router;