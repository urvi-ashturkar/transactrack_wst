const express = require("express");
const Router = express.Router();
const con = require("../connection");
var extend = require("util")._extend;

//Router to GET specific learner detail from the MySQL database
Router.get("/:id", (req, res) => {
  //console.log(req.params);
  q =
    "select distinct first_name, last_name, task_name, deadline from (team_member JOIN works_on) JOIN task where team_member.mis = ? and discharge_date IS NULL;";
  m = req.params.id.slice(1);
  con.query(q, m, (err, rows, fields) => {
    if (!err) {
      console.log(rows);
      res.send(rows);
    } else console.log(err);
  });
  //   var o = extend({}, { name: "John" });
  //   extend(o, { location: "San Jose" });
  //   console.log(rows1 + rows2);
});

module.exports = Router;
