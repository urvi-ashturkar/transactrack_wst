const express = require("express");
const Router = express.Router();
const con = require("../connection");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

let saltRounds = 5;
Router.post("/", function (req, res) {
  bcrypt.hash(req.body.password, urlencodedParser, saltRounds, (err, hash) => {
    var query = `insert into team_member (mis, first_name, last_name, email, phone, dob, cgpa, is_hostelite, join_date, position, password) select ${req.body.mis} "${req.body.first_name}", "${req.body.last_name}", "${req.body.email}", ${req.body.phone}, ${req.body.dob}, ${req.body.cgpa}, ${req.body.is_hostelite}, ${req.body.join_date}, "${req.body.position}","${hash}" where not exists (select mis from team_member where mis = "${req.body.mis}");`;
    con.query(query, (err, result) => {
      if (err) {
        res.status(400).send(err.message);
      }
      return res.status(200).send(result);
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

module.exports = Router;
