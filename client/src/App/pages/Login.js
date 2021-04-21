import React, { Component } from "react";
import cover from "../cover.jpg";
import { validateFields } from "../Validation";
import classnames from "classnames";
import axios from "axios";
import {reactLocalStorage} from 'reactjs-localstorage';
import Dashboard from "./Dashboard";
import {Redirect, useHistory} from "react-router-dom";
import "../App.css";
{/*import { useState, useEffect } from "react";*/}

{/*
const cred_state = {
  mis: {
    value: "",
    validateOnChange: false,
    error: "",
  },
  password: {
    value: "",
    validateOnChange: false,
    error: "",
  },
  submitCalled: false,
  allFieldsValidated: false,
};


handleNotFocus(validationFunc, evt) {
  const field = evt.target.name;

  if (
    cred_state[field]["validateOnChange"] === false &&
    cred_state.submitCalled === false
  ) {
    this.setState((state) => ({
      [field]: {
        ...state[field],
        validateOnChange: true,
        error: validationFunc(state[field].value),
      },
    }));
  }
  return;
}

handleChange(validationFunc, evt) {
  const field = evt.target.name;
  const fieldVal = evt.target.value;
  this.setState((state) => ({
    [field]: {
      ...state[field],
      value: fieldVal,
      error: state[field]["validateOnChange"] ? validationFunc(fieldVal) : "",
    },
  }));
}

handleSubmit(evt) {
  evt.preventDefault();
  // validate all fields
  const { mis, password } = cred_state;
  const misError = validateFields.validateMis(mis.value);
  const passwordError = validateFields.validatePassword(password.value);
  if ([misError, passwordError].every((e) => e === false)) {
    // no errors. Submit the form
    console.log("success");
    this.setState({ ...initialState, allFieldsValidated: true });
    axios
      .post("http://localhost:5000/login", cred_state)
      .then((res) => {
        console.log("axios success", res.data[0]);
      })
      .catch((err) => {
        console.log("fail" + err);
      });

  } else {
    // update the state with errors
    this.setState((state) => ({
      mis: {
        ...state.mis,
        validateOnChange: true,
        error: misError,
      },
      password: {
        ...state.password,
        validateOnChange: true,
        error: passwordError,
      },
    }));
  }
}
*/}

const Login = () => {

  {/*const [user_details, setUserDetails] = useState({});*/}
  const history = useHistory();
  const user_details = {};

  const handleSubmit = (e) => {
    e.preventDefault();
    const creds = {
      mis: e.target.mis.value,
      password: e.target.password.value,
    };
    console.log("creds: ", creds);
    axios
      .post("http://localhost:5000/login", creds)
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
    e.target.mis.value = "";
    e.target.password.value = "";

  }

  return (
    <div className="App">
      <main role="main" class="container">
        <div className="row" id="login-content">
          <div className="col-12 col-md-8">
            <img src={cover} id="cover" alt="team" width="100%" />
          </div>

          <div className="content-section col-12 col-md-4">
            <form onSubmit={handleSubmit}>
              <fieldset className="form-group">
                <legend className="border-bottom mb-4">Log In</legend>
                {/* Mis field */}
                <div className="form-group">
                  <label>MIS</label><br/>
                  <input className="login-input"
                    type="text"
                    name="mis"
                    placeholder="Enter college-issued MIS"
                    required
                  />
                </div>

                {/* Password field */}
                <div className="form-group">
                  <label>Password</label><br/>
                  <input className="login-input"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </fieldset>
              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-info"
                >
                  Submit
                </button>
              </div><br/>
              <small className="text-muted ml-2">
                <a href="#">Forgot Password?</a>
              </small>
            </form>
            <div className="border-top pt-3">
              <small className="text-muted">
                New to the team?{" "}
                <a className="ml-2" href="/register">
                  Sign Up Now
                </a>
              </small>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default Login;
