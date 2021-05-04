import React, { useState, useEffect } from "react";
import axios from "axios";
import {reactLocalStorage} from 'reactjs-localstorage';
import {useHistory} from "react-router-dom";
import { Control, LocalForm, Errors } from 'react-redux-form';
import {
    Button,
    Navbar, NavbarBrand, Nav, NavItem,
    Container,
    Row, Col,
    Modal, ModalHeader, ModalBody,
} from 'reactstrap';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import "../App.css";

const Dashboard = () => {

  const user_details = reactLocalStorage.getObject("user_details");
  const history = useHistory();
  const [modal_open, setModalOpen] = useState(false);
  const [modal_edit_open, setEditModalOpen] = useState(false);
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
    // console.log(new Date(), today, val, ip);
    return (today - ip) >= 0;
  }

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

  function logout() {
    reactLocalStorage.clear();
    history.push("/login");
  }

  function toggle() {
    setModalOpen(!modal_open);
  }

  function handleSubmit(e) {
    // let corr_date = new Date(e.date.replace(/-/g, '\/').replace(/T.+/, ''));
    // let clipped_date = String(corr_date).slice(0,10);
    // console.log(e.date, clipped_date);
    // var curr = new Date();
    // var set = new Date(curr.getTime() + 86400000);
    // var date = set.getFullYear().toString() + "-" + (set.getMonth() + 1).toString().padStart(2, "0") + "-" + set.getDate().toString().padStart(2, "0");

    const txn_info = {
      txn_id: e.txn_no,
      date: e.date,
      vendor: e.vendor,
      gst: e.gst_no,
      amount: e.amount,
      memo: e.memo,
      mis: user_details.mis,
    }

    axios
      .post("http://localhost:5000/dashboard", txn_info)
      .then((res) => {
        reactLocalStorage.setObject("user_details", user_details);
        history.push("/dashboard");
      })
      .catch((err) => {
        console.log("fail" + err);
        alert("A transaction already exists with this Transaction ID.\n1");
      });
    setModalOpen(false);
  }

  function handleEdit(e, txn_no){
    const txn_info = {
      txn_id: txn_no,
      date: e.date,
      vendor: e.vendor,
      gst: e.gst_no,
      amount: e.amount,
      memo: e.memo,
      mis: user_details.mis,
    }

    axios
      .post("http://localhost:5000/dashboard/edit", txn_info)
      .then((res) => {
        console.log(user_details);
        reactLocalStorage.setObject("user_details", user_details);
        history.push("/dashboard");
      })
      .catch((err) => {
        console.log("fail" + err);
        alert("Record edit failed.\nPlease try again later.\n");
      });
      setEditModalOpen(false);
  }

  function handleDelete(e, transac_id) {
    var confirmation = window.confirm("Are you sure you want to delete this record?\nThis action cannot be undone.");

    if(confirmation) {
      const txn_dlt = {
        txn_id: transac_id,
      }
      axios
        .post("http://localhost:5000/dashboard/delete", txn_dlt)
        .then((res) => {
          axios.get('/dashboard', {
            params: {
              mis: mis_param,
              position: pos,
              portfolio: portf,
            }
          })
          .then(function (response) {
            reactLocalStorage.setObject("transactions", response.data);
            setTransactions(response.data);
            setLoading(false);
          })
          .catch((err) => {
            console.log("axios fail in dashboard ", err);
          });

         //setTransactions(res.data);
        })
        .catch((err) => {
          console.log("fail" + err);
        });
    }
    else {
      ;
    }

  }

  function toggle_edit(txn){
    if(modal_edit_open === false){
      let txn_to_edit = {
        txn_no : txn.transaction_id,
        date : String(txn.transaction_date).slice(0,10),
        vendor : txn.vendor,
        gst_no : txn.gst_no,
        amount : txn.amount,
        memo : txn.memo
      }
      console.log(txn_to_edit);
      reactLocalStorage.setObject("txn_to_edit", txn_to_edit);
    }
    setEditModalOpen(!modal_edit_open);
  }

  function getTheDate(txn_date){
    let a = String(txn_date).slice(0,8);
    let x = Number(String(txn_date).slice(8,10)) + 1;
    if(x<10 && x>0){
      a = a.concat("0");
    }
    let res = a.concat(x);
    return res;
  }

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
                {!txn.mis || txn.mis === reactLocalStorage.getObject("user_details").mis
                  ?
                  <Col>
                    <i className="bi bi-pencil-square" onClick={() => toggle_edit(txn)}></i>
                    &emsp;&emsp;&emsp;
                    <i className="bi bi-trash" onClick={(e) => handleDelete(e, txn.transaction_id)}></i>
                  </Col>
                  :
                  console.log(txn.mis, reactLocalStorage.getObject("user_details").mis)
                }

              </Row>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={txn.transaction_id}>
              <Card.Body>
                <h5 className="ml-auto"><b>TXN# {txn.transaction_id} &nbsp; | &nbsp; GST# {txn.gst_no}</b></h5>
                <p className="txn-memo">{txn.memo}</p>
                <Row className="txn-pills">
                  <Col sm={3}>
                    <span className="badge badge-pill badge-lt-blue">{getTheDate(txn.transaction_date)}</span>
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
        <Modal isOpen={modal_open} toggle={toggle} >
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

        <Modal isOpen={modal_edit_open} toggle={toggle_edit} >
          <ModalHeader>Edit Transaction</ModalHeader>
          <ModalBody>
            <LocalForm
              model="e"
              onSubmit={ (e) => handleEdit(e, reactLocalStorage.getObject("txn_to_edit").txn_no) }
              initialState={ reactLocalStorage.getObject("txn_to_edit") }
            >
              <Row className="form-group ml-1 mr-1">
                <label htmlFor="txn_no">Transaction Reference ID</label>
                <Control.text model=".txn_no" name="txn_no" className="form-control" disabled={true}
                  />
              </Row>
              <Row className="form-group ml-1 mr-1">
                <label>Transaction Date</label>
                <Control.text model=".date" name="date" className="form-control"
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
                <p>✏️Please re-enter the amount (if same) for confirmation.</p>
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
              <Button className="btn btn-default row-btns" onClick={toggle_edit}>Cancel</Button>
            </LocalForm>
          </ModalBody>
        </Modal>

      </main>
    </React.Fragment>
  );
}

export default Dashboard;
