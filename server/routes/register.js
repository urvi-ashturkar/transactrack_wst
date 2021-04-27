const express = require("express");
const Router = express.Router();
const con = require("../connection");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
var bcrypt = require("bcryptjs");

let saltRounds = 5;

Router.post("/", (req, res) => {

  const { mis, first_name, password } = req.body;

  bcrypt.hash(req.body.password.value, saltRounds, (err, hash) => {
    // let query = `insert into team_member (mis, first_name, last_name, position, password, portfolio) select ${req.body.mis.value}, "${req.body.first_name.value}", "${req.body.last_name.value}", "${req.body.position.value}","${hash}", "${req.body.portfolio.value}" where not exists (select mis from team_member where mis = ${req.body.mis.value});`;
    let query = `insert into team_member (mis, first_name, last_name, position, password, portfolio) values (${req.body.mis.value}, "${req.body.first_name.value}", "${req.body.last_name.value}", "${req.body.position.value}","${hash}", "${req.body.portfolio.value}");`;
    console.log(query);
    con.query(query, (err, result) => {
      console.log(result);
      if (err) {
        res.status(400).send(err.message);
      }
      else {
        return res.status(200).send(result);
      }
    });
  });
});

// Router.get("/", (req, res) => {
//   res.send("Hello world");
// });

module.exports = Router;
