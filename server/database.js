var mysql = require("mysql");
require('dotenv').config()

var connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

connection.connect(function (error) {
  if (!!error) {
    console.log(error);
  } else {
    console.log("connected...!");
  }
});

module.exports = connection;
