const express = require("express");
const Router = express.Router();
const con = require("../connection");
const bcrypt = require("bcryptjs");
Router.post("/", (req, res) => {
  //console.log(req);
  console.log("req.body.mis.value: ", req.body.mis.value);
  query = `SELECT mis, password, first_name, last_name, position, portfolio FROM team_member WHERE mis = ${req.body.mis.value}`;
  con.query(query, (err, result) => {
    if (err) {
      return res.status(400).send(err.message);
    }
    if (result.length > 0) {
      let string = JSON.stringify(result);
      console.log(">> string: ", string);
      let json = JSON.parse(string);
      console.log(">> json: ", json);
      bcrypt.compare(
        req.body.password.value,
        json[0].password,
        (error, response) => {
          if (response) {
            //req.session.user = result;
            //console.log(`After login ${req.session.user}`)
            console.log("req pass: ", req.body.password.value);
            console.log("json: ", json[0].password);
            console.log("json - ", json);
            res.send(json);
          } else {
            res.send({
              message: "Incorrect username or password.\nTry again.",
            });
            console.log("req pass: ", req.body.password.value);
            console.log("json: ", json[0].password);
            console.log("json - ", json);
          }
        }
      );
    } else {
      res.send({ message: "Incorrect username or password.\nTry again." });
    }
  });
});

// //Router to GET specific learner detail from the MySQL database
// Router.get("/:id", (req, res) => {
//   con.query(
//     "SELECT * FROM portfolio WHERE portfolio_id = ?",
//     req.params.id.slice(1),
//     (err, rows, fields) => {
//       if (!err) {
//         res.send(rows);
//         console.log(req.params.id.slice(1));
//       } else console.log(err);
//     }
//   );
// });

module.exports = Router;
