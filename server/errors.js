const errors = {
    errorCode: (dberr, res) => {
        if (dberr == "missing params") {
            res.status(400).send("Missing params")
        }

        else if (dberr == "wrong password") {
            res.status(403).send("wrong password")
        }

        else if (dberr == "wrong username") {
            res.status(403).send("wrong username")
        }

        else if (dberr.errno == 1062) {
            res.status(403).send("Username already exist")
        }

        else if (dberr.errno == 1048) {
            res.status(403).send("Birthdate not valid")
        }

        else {
            res.status(400).send("unknown error" + dberr)
        }
    }
}

module.exports = errors;