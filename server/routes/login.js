const express = require("express");
const Router = express.Router();
const con = require("../connection");

Router.get("/", (req, res) => {
  //console.log(req);
  con.query(
    "SELECT password, first_name, last_name, position FROM team_member WHERE mis = ?",
    111803041,
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
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
