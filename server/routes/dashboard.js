const express = require("express");
const Router = express.Router();
const con = require("../connection");
//var extend = require("util")._extend;

//Router to GET specific learner detail from the MySQL database
Router.get("/", (req, res) => {
  if(req.query.position === "Secretary"){
    q =
    `select distinct mis, first_name, last_name, position, portfolio, transaction_id, transaction_date, amount, gst_no, vendor, memo from team_member INNER JOIN transactions ON team_member.mis = transactions.team_member_id;`;
  }
  else{
    if((req.query.position === "Portfolio Head") && (req.query.portfolio === "Accounts")){
      q =
      `select distinct mis, first_name, last_name, position, portfolio, transaction_id, transaction_date, amount, gst_no, vendor, memo from team_member INNER JOIN transactions ON team_member.mis = transactions.team_member_id;`;
    }
    else{
      q =
      `select * from transactions where team_member_id = ${req.query.mis};`;
    }

  }
  con.query(q, (err, result, fields) => {
    if (!err) {
      let string = JSON.stringify(result);
      let json = JSON.parse(string);
      res.status(200).send(json);
    } else{
      console.log(err);
      res.status(400).send([{ message: `Some issue: ${err}\nTry again.`}]);
    }
  });
});


Router.post("/delete", (req, res) => {
  query = `DELETE FROM transactions WHERE transaction_id = "${req.body.txn_id}"`;
  con.query(query, (err, result) => {
    if(!err){
      let string = JSON.stringify(result);
      let json = JSON.parse(string);
      res.status(200).send(json);
    }
    else{
      res.status(400).send(err.message);
    }
  });
});

Router.post("/", (req, res) => {
  query = `INSERT into transactions values("${req.body.txn_id}", "${req.body.date}", ${req.body.amount}, "${req.body.gst}", "${req.body.vendor}", ${req.body.mis}, "${req.body.memo}");`;
  con.query(query, (err, result) => {
    if(!err){
      let string = JSON.stringify(result);
      let json = JSON.parse(string);
      res.status(200).send(json);
    }
    else{
      res.status(400).send(err.message);
    }
  });
});

Router.post("/delete", (req, res) => {
  query = `DELETE FROM transactions WHERE transaction_id = "${req.body.txn_id}"`;
  con.query(query, (err, result) => {
    if(!err){
      let string = JSON.stringify(result);
      let json = JSON.parse(string);
      res.status(200).send(json);
    }
    else{
      res.status(400).send(err.message);
    }
  });
});

Router.post("/edit", (req, res) => {
  query = `UPDATE transactions SET transaction_date = "${req.body.date}", amount = ${req.body.amount}, gst_no = "${req.body.gst}", vendor = "${req.body.vendor}", team_member_id = ${req.body.mis}, memo = "${req.body.memo}") WHERE transaction_id = "${req.body.txn_id}";`;
  con.query(query, (err, result) => {
    if(!err){
      let string = JSON.stringify(result);
      let json = JSON.parse(string);
      res.status(200).send(json);
    }
    else{
      res.status(400).send(err.message);
    }
  });
});


module.exports = Router;
