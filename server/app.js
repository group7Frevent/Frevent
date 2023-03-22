var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
var http = require("http").createServer(app);
var io = require("socket.io")(http);
http.listen(3002);
var file1 = require('./socket_io/socketio')(io)


dotenv.config();

var indexRouter = require('./routes/index');
var authRoute = require('./routes/auth')
var messageRoute = require('./routes/messages')
var settingsRoute = require('./routes/settings')

var app = express();

var app = express();
var cors = require('cors')



app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRoute)
app.use('/messages', messageRoute)
app.use('/settings', settingsRoute)

//app.use(authenticateToken);



function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    console.log("token = " + token);
    console.log("Here")
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.MY_TOKEN, (err, user) => {
        console.log(err)

        if (err) return res.sendStatus(403)

        req.user = user

        next()
    })
}

module.exports = app;
