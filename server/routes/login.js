const express = require("express");
const Router = express.Router();
const con = require("../connection");

Router.post("/", (req, res) => {
  //console.log(req);
  console.log("req.body.mis.value: ", req.body.mis.value);
  con.query(
    "SELECT password, first_name, last_name, position FROM team_member WHERE mis = ?",
    req.body.mis.value,
    (err, rows, fields) => {
      if (!err) {
        // console.log("rows: ", rows);
        // console.log("body: ", rows.body);
        // console.log("first_name: ", rows.first_name);
        let string = JSON.stringify(rows);
        console.log(">> string: ", string);
        let json = JSON.parse(string);
        console.log(">> json: ", json);
        res.send(json);
        console.log("Sent login info");
      } else {
        console.log(err);
      }
    }
  );
});

//Router to GET specific learner detail from the MySQL database
Router.get("/:id", (req, res) => {
  con.query(
    "SELECT * FROM portfolio WHERE portfolio_id = ?",
    req.params.id.slice(1),
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
        console.log(req.params.id.slice(1));
      } else console.log(err);
    }
  );
});

module.exports = Router;
