import React, { useState, useEffect, Component } from "react";
import { validateFields } from "../Validation";
import classnames from "classnames";
import axios from "axios";
import {reactLocalStorage} from 'reactjs-localstorage';
import {Redirect, useHistory} from "react-router-dom";
import { Label, Control, LocalForm, Errors } from 'react-redux-form';
import {
    Button,
    Input,
    Navbar, NavbarBrand, Nav, NavItem, NavLink,
    Container,
    Row, Col,
    Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import "../App.css";

const Dashboard = () => {

  const user_details = reactLocalStorage.getObject("user_details");
  const history = useHistory();
  const [modal_open, setModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState();
  //Mugdha : axios.get needed to get the list of all transactions.
  //response.data gives the entire array of all transactions. Loop through it to display

  const required = (val) => val && val.length;
  const maxLength = (len) => (val) => !(val) || (val.length <= len);
  const minLength = (len) => (val) => (val) && (val.length >= len);
  const isLength = (len) => (val) => (val) && (val.length === len);
  const matchPattern = (re) => (val) => re.test(val);
  const isPast = (val) => {
    var today = new Date().getTime();
    var ip = new Date(val).getTime();
    console.log(new Date(), today, val, ip);
    return (today - ip) >= 0;
  }

console.log(user_details);
  const mis_param = user_details.mis;
  const pos = user_details.position;
  const portf = user_details.portfolio;
  useEffect(() => {
    axios.get('/dashboard', {
      params: {
        mis: mis_param,
        position: pos,
        portfolio: portf,
      }
    })
    .then(function (response) {
      console.log("axios success in dashboard ", response.data);
      reactLocalStorage.setObject("transactions", response.data);
      setTransactions(response.data);
      setLoading(false);
    })
    .catch((err) => {
      console.log("axios fail in dashboard ", err);
    });
  }, []);

  if (isLoading) {
    return <div className="App">Loading...</div>;
  }

  //console.log(user_details);
  // const mis_param = user_details.mis;
  // const pos = user_details.position;
  // const portf = user_details.portfolio;

  console.log("after axios\n");


  function logout() {
    reactLocalStorage.clear();
    history.push("/login");
  }

  function toggle() {
    setModalOpen(!modal_open);
  }

  function handleSubmit(e) {
    const txn_info = {
      txn_id: e.txn_no,
      date: e.date,
      vendor: e.vendor,
      gst: e.gst_no,
      amount: e.amount,
      memo: e.memo,
      mis: user_details.mis,
    }
    {/*
    console.log(e);
    console.log(txn_info.mis, txn_info.date);
    Mugdha :
    */}
    axios
      .post("http://localhost:5000/dashboard", txn_info)
      .then((res) => {
        {/*console.log("res:", res)
        console.log("res.data:", res.data)
        console.log("res.data[0]:", res.data[0])
        console.log("axios success in login", res.data[0]);
        const thisTxn = res.data[0];
        reactLocalStorage.setObject("transactions", thisTxn);*/}
        const user_details = reactLocalStorage.getObject("user_details");
        console.log("In 2nd axios: ");
        console.log(user_details);
        reactLocalStorage.setObject("user_details", user_details);
        history.push("/dashboard");
      })
      .catch((err) => {
        console.log("fail" + err);
      });
    setModalOpen(false);
  }

  // const transactions = reactLocalStorage.getObject("transactions");
  console.log(transactions);
  const transactions_list = transactions.map((txn) => (
    <React.Fragment key={txn.transaction_id}>
      <Accordion defaultActiveKey="0">
        <Card>
            <Accordion.Toggle as={Card.Header} eventKey={txn.transaction_id}>
              <Row>
                <Col sm={8}><b>{txn.vendor}</b></Col>
                <Col>
                  {txn.amount > 0
                    ?
                  <span className="badge badge-pill badge-warning ml-3">+{txn.amount}</span>
                    :
                  <span className="badge badge-pill badge-warning ml-3">{txn.amount}</span>
                  }
                </Col>
              </Row>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={txn.transaction_id}>
              <Card.Body>
                <h5 className="ml-auto"><b>TXN# {txn.transaction_id} &nbsp; | &nbsp; GST# {txn.gst_no}</b></h5>
                <p className="txn-memo">{txn.memo}</p>
                <Row className="txn-pills">
                  <Col sm={3}>
                    <span className="badge badge-pill badge-lt-blue">{String(txn.transaction_date).slice(0,10)}</span>
                  </Col>
                  {txn.first_name
                    ?
                    <Col sm={4}>
                      <span className="badge badge-pill badge-lt-blue">{txn.first_name + ' ' + txn.last_name}</span>
                    </Col>
                    :
                    null
                  }
                  {txn.portfolio && txn.portfolio !== ""
                    ?
                    <Col sm={4}>
                      <span className="badge badge-pill badge-lt-blue">{txn.portfolio}</span>
                    </Col>
                    : txn.position === "Secretary"
                      ?
                      <Col sm={4}>
                        <span className="badge badge-pill badge-lt-blue">Secretary</span>
                      </Col>
                      :
                      null
                  }
                </Row>
              </Card.Body>
            </Accordion.Collapse>
        </Card>
      </Accordion>
    </React.Fragment>
  ))

  return(
    <React.Fragment>
      <Navbar color="dark" dark expand="sm" className="mb-5" fixed="top">
        <Container>
          <NavbarBrand className="mr-auto" href="/dashboard">
            {user_details.portfolio ?
              <span>
                <b>Dashboard</b> &nbsp;&nbsp; {user_details.first_name} {user_details.last_name} &nbsp; | &nbsp; {user_details.position}, {user_details.portfolio}
              </span>
              :
              <span>
                <b>Dashboard</b> &nbsp;&nbsp; {user_details.first_name} {user_details.last_name} &nbsp; | &nbsp; {user_details.position}
              </span>
            }
          </NavbarBrand>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <Button className="btn btn-default" onClick={logout}>Logout</Button>
            </NavItem>
          </Nav>
        </Container>
      </Navbar>

      <main role="main" className="toplookout container">
        {(user_details.position === "Secretary") || (user_details.position === "Portfolio Head" && user_details.portfolio === "Accounts")
          ?
        <h2>All transactions</h2>
          :
        <h2>My transactions</h2>
        }
        <br/>
        <Button className="btn btn-warning btn-lg shadow-sm" onClick={toggle}>Record New</Button>
        <br/><br/>
        <Row>
          <Col sm={10}>
            {transactions_list}
          </Col>
        </Row>
        <Modal
          isOpen={modal_open}
          toggle={toggle}
        >
          <ModalHeader>Record New Transaction</ModalHeader>
          <ModalBody>
            <LocalForm
              model="e"
              onSubmit={ (e) => handleSubmit(e) }
            >
              <Row className="form-group ml-1 mr-1">
                <label htmlFor="txn_no">Transaction Reference ID</label>
                <Control.text model=".txn_no" name="txn_no" className="form-control"
                  validators={{
                    required, minLength: minLength(12), matchPattern: matchPattern(/[0-9A-Za-z]+/)
                  }}/>
                <Errors
                  className="text-danger"
                  model=".txn_no"
                  show="touched"
                  messages={{
                    required: 'Required. ',
                    minLength: 'Must be at least 12 characters long. ',
                    matchPattern: 'Invalid transaction ID. '
                  }}
                />
              </Row>
              <Row className="form-group ml-1 mr-1">
                <label>Transaction Date</label>
                {/*<Input type="date" model=".date" name="date" className="form-control" />*/}
                <Control.text model=".date" name="date" placeholder="YYYY-MM-DD" className="form-control"
                validators={{
                  required, isPast, matchPattern: matchPattern(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/)
                }}/>
                <Errors
                  className="text-danger"
                  model=".date"
                  show="touched"
                  messages={{
                    required: 'Required. ',
                    isPast: 'Recording future transactions not allowed. ',
                    matchPattern: 'Invalid date. '
                  }}
                />
              </Row>
              <Row className="form-group ml-1 mr-1">
                <label htmlFor="vendor">Vendor</label>
                <Control.text model=".vendor" name="vendor" className="form-control"
                validators={{
                  required
                }}/>
                <Errors
                  className="text-danger"
                  model=".vendor"
                  show="touched"
                  messages={{
                    required: 'Required. '
                  }}
                />
              </Row>
              <Row className="form-group ml-1 mr-1">
                <label htmlFor="gst_no">GST No.</label>
                <Control.text model=".gst_no" name="gst_no" className="form-control"
                validators={{
                  required, isLength: isLength(15), matchPattern: matchPattern(/[0-9][0-9][0-9A-Z][0-9A-Z][0-9A-Z][0-9A-Z][0-9A-Z][0-9A-Z][0-9A-Z][0-9A-Z][0-9A-Z][0-9A-Z][0-9]Z[0-9A-Z]/)
                }}/>
                <Errors
                  className="text-danger"
                  model=".gst_no"
                  show="touched"
                  messages={{
                    required: 'Required. ',
                    isLength: 'Must be 15 characters long. ',
                    matchPattern: 'Invalid GST No. '
                  }}
                />
              </Row>
              <Row className="form-group ml-1 mr-1">
                <label htmlFor="amount">Transaction Amount (-ve for expenditure)</label>
                <Control.text model=".amount" name="amount" className="form-control"
                validators={{
                  required, matchPattern: matchPattern(/^-?[0-9]\d*(\.\d{1,2})?$/)
                }}/>
                <Errors
                  className="text-danger"
                  model=".amount"
                  show="touched"
                  messages={{
                    required: 'Required. ',
                    matchPattern: 'Invalid amount. '
                  }}
                />
              </Row>
              <Row className="form-group ml-1 mr-1">
                <label htmlFor="memo">Brief memo of transaction</label>
                <Control.textarea model=".memo" name="memo" className="form-control"
                validators={{
                  required, isLength: maxLength(200)
                }}/>
                <Errors
                  className="text-danger"
                  model=".memo"
                  show="touched"
                  messages={{
                    required: 'Required. ',
                    maxLength: 'Must be less than 200 characters long. '
                  }}
                />
              </Row>
              <Button className="btn btn-success row-btns" type="submit">Save</Button>
              <Button className="btn btn-default row-btns" onClick={toggle}>Cancel</Button>
            </LocalForm>
          </ModalBody>
        </Modal>
      </main>
    </React.Fragment>
  );
}

export default Dashboard;
