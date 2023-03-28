var express = require('express');
var router = express.Router();
var eventDetails = require("../models/eventDetails")

router.get('/getevents/:id', (req, res) => {
    if (req.params.id) {

        eventDetails.getEventDetails(req.params.id, (dbError, dbresult) => {
            if (dbresult) {
                res.send(dbresult)
            }
            else {
                res.send(dbError)
            }
        })
    }
})


module.exports = router;