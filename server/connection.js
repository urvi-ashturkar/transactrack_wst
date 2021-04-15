const mysql = require("mysql");
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "teamDB",
  multipleStatements: true,
});

con.connect((err) => {
  if (!err) {
    console.log("Connected");
  } else {
    console.log("Connection failed");
  }
});

module.exports = con;
