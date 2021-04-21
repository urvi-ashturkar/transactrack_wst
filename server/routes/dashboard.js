const express = require("express");
const Router = express.Router();
const con = require("../connection");
//var extend = require("util")._extend;

//Router to GET specific learner detail from the MySQL database
Router.get("/", (req, res) => {
  console.log("0: ", req);
  console.log("1: ", req.params);
  console.log("2 ", req.params.mis);
  console.log("3 ", req.query.mis);
  q =
    `select * from transactions where team_member_id = ${req.query.mis};`;
  con.query(q, (err, result, fields) => {
    if (!err) {
      let string = JSON.stringify(result);
      console.log(">> string: ", string);
      let json = JSON.parse(string);
      console.log(">> json: ", json);
      // console.log(rows);
      res.send(json);
    } else{
      console.log(err);
      res.send([{ message: `Some issue: ${err}\nTry again.`}]);
    } 
  });
});


Router.post("/", (req, res) => {
  //console.log(req);
  console.log("req.body.mis: ", req.body.mis);
  query = `INSERT into transactions values("${req.body.txn_id}", "${req.body.date}", ${req.body.amount}, "${req.body.gst}", "${req.body.vendor}", ${req.body.mis}, "${req.body.memo}");`;
  con.query(query, (err, result) => {
    if(!err){
      let string = JSON.stringify(result);
      console.log(">> string: ", string);
      let json = JSON.parse(string);
      console.log(">> json: ", json);
      res.status(200).send(json);
    }
    else{
      res.status(400).send(err.message);
    }
  });
});


module.exports = Router;

// Router.post("/delegate", (req, res) => {
//   q = "";
//   m = 0;
//   con.query(q, m, (err, rows, fields) => {
//     if (!err) {
//       console.log(rows);
//       res.send(rows);
//     } else console.log(err);
//   });
// });
