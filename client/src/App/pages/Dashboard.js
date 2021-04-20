import React, { Component } from "react";
import { validateFields } from "../Validation";
import classnames from "classnames";
import axios from "axios";
import {reactLocalStorage} from 'reactjs-localstorage';
import {Redirect, useHistory} from "react-router-dom";
import {
    Button,
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Container
} from 'reactstrap';
import "../App.css";

const Dashboard = () => {

  const user_details = reactLocalStorage.getObject("user_details");
  const history = useHistory();

  function logout() {
    reactLocalStorage.clear();
    history.push("/login");
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
    </React.Fragment>
  );
}

export default Dashboard;
