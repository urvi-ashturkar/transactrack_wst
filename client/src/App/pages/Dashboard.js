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
import "../App.css";

const Dashboard = () => {

  const user_details = reactLocalStorage.getObject("user_details");
  const history = useHistory();
  const [modal_open, setModalOpen] = useState(false);

  //Mugdha : axios.get needed to get the list of all transactions. 
  //response.data gives the entire array of all transactions. Loop through it to display

  console.log(user_details);
  axios.get('/dashboard', {
    params: {
      mis: user_details.mis,
    }
  })
  .then(function (response) {
    console.log("axios success in dashboard ", response.data);
  })
  .catch((err) => {
    console.log("axios fail in  dashboard ", err);
  });
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
    console.log(e);
    console.log(txn_info.mis, txn_info.date);
    //Mugdha :
    axios
      .post("http://localhost:5000/dashboard", txn_info)
      .then((res) => {
        console.log("res:", res)
        console.log("res.data:", res.data)
        console.log("res.data[0]:", res.data[0])
        console.log("axios success in login", res.data[0]);
        const thisUser = res.data[0];
        {/*setUserDetails({...user_details, thisUser});*/}
        // con
       reactLocalStorage.setObject("user_details", thisUser);
        history.push("/dashboard");
      })
      .catch((err) => {
        console.log("fail" + err);
      });
    setModalOpen(false);
  }

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
        <Button className="btn btn-warning btn-lg" onClick={toggle}>Record New</Button>
        <br/><br/>
        <Row>
          <Col sm={10}>
            <article className="media content-section">
              <div className="media-body">
                <div className="article-metadata">
                  <h3 className="article-title">
                    <b>Venus Traders</b>
                    <span className="badge badge-pill badge-warning ml-3">+ 3400</span>
                  </h3>
                  <h5 className="ml-auto"><b>TXN# 872133000G7 &nbsp; | &nbsp; GST# 9726494692692</b></h5>
                  <p className="article-content txn-memo">Mount board, oil paints, acrylic paints, paintbrushes, masking tape, corrugated sheets for decor work.</p>
                </div>
                <Row className="txn-pills">
                  <Col sm={3}>
                    <span className="badge badge-pill badge-lt-blue">12/04/2021</span>
                  </Col>
                  <Col sm={4}>
                    <span className="badge badge-pill badge-lt-blue">Print and Purchase</span>
                  </Col>
                  <Col sm={5}>
                    <span className="badge badge-pill badge-lt-blue">Atharva Soman</span>
                  </Col>
                </Row>
              </div>
            </article>
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
                <Control.text model=".txn_no" name="txn_no" className="form-control" />
                <Errors
                  className="text-danger"
                  model=".txn_no"
                  show="touched"
                />
              </Row>
              <Row className="form-group ml-1 mr-1">
                <label>Transaction Date</label>
                {/*<Input type="date" model=".date" name="date" className="form-control" />*/}
                <Control.text model=".date" name="date" className="form-control" />
                <Errors
                  className="text-danger"
                  model=".date"
                  show="touched"
                />
              </Row>
              <Row className="form-group ml-1 mr-1">
                <label htmlFor="vendor">Vendor</label>
                <Control.text model=".vendor" name="vendor" className="form-control" />
                <Errors
                  className="text-danger"
                  model=".vendor"
                  show="touched"
                />
              </Row>
              <Row className="form-group ml-1 mr-1">
                <label htmlFor="gst_no">GST No.</label>
                <Control.text model=".gst_no" name="gst_no" className="form-control" />
                <Errors
                  className="text-danger"
                  model=".gst_no"
                  show="touched"
                />
              </Row>
              <Row className="form-group ml-1 mr-1">
                <label htmlFor="amount">Transaction Amount (-ve for expenditure)</label>
                <Control.text model=".amount" name="amount" className="form-control" />
                <Errors
                  className="text-danger"
                  model=".amount"
                  show="touched"
                />
              </Row>
              <Row className="form-group ml-1 mr-1">
                <label htmlFor="memo">Brief memo of transaction</label>
                <Control.textarea model=".memo" name="memo" className="form-control" />
                <Errors
                  className="text-danger"
                  model=".memo"
                  show="touched"
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
