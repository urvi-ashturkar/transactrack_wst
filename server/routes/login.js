const express = require("express");
const Router = express.Router();
const con = require("../connection");
const bcrypt = require("bcryptjs");
Router.post("/", (req, res) => {
  query = `SELECT mis, password, first_name, last_name, position, portfolio FROM team_member WHERE mis = ${req.body.mis}`;
  con.query(query, (err, result) => {
    if (err) {
      return res.status(400).send(err.message);
    }
    if (result.length > 0) {
      let string = JSON.stringify(result);
      let json = JSON.parse(string);
      bcrypt.compare(
        req.body.password,
        json[0].password,
        (error, response) => {
          if (response) {
            json[0].message = "Authentication Successful.\n"
            res.send(json);
          } else {
            res.send([{
              message: "Incorrect username or password.\nTry again.",
            }]);
          }
        }
      );
    } else {
      res.send([{ message: "Incorrect username or password.\nTry again." }]);
    }
  });
});

module.exports = Router;
