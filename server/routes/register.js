const express = require("express");
const Router = express.Router();
const con = require("../connection");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
var bcrypt = require("bcryptjs");

let saltRounds = 5;

Router.post("/", (req, res) => {
  console.log("in router.post" + req);
  const { mis, first_name, password } = req.body;
  console.log(mis, first_name, password);
  console.log("req body password" + req.body.password);
  bcrypt.hash(req.body.password.value, saltRounds, (err, hash) => {
    let query = `insert into team_member (mis, first_name, last_name, email, phone, position, password, portfolio) select ${req.body.mis.value}, "${req.body.first_name.value}", "${req.body.last_name.value}", "${req.body.email.value}", ${req.body.phone.value}, "${req.body.position.value}","${hash}", "${req.body.portfolio.value}" where not exists (select mis from team_member where mis = ${req.body.mis.value});`;
    console.log(query);
    con.query(query, (err, result) => {
      if (err) {
        res.status(400).send(err.message);
      }
      return res.status(200).send(result);
      //
    });
  });

  //   // Prepare output in JSON format
  //   response = {
  //     MIS: req.body.mis,
  //     first_name: req.body.first_name,
  //     last_name: req.body.last_name,
  //     task: req.body.task
  //   };
  //   console.log(response);
  //   res.end(JSON.stringify(response));
});

Router.get("/", (req, res) => {
  res.send("Hello world");
});

module.exports = Router;
