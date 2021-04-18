const mysql = require("mysql");
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "elephant9",
  database: "transactionDB",
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
