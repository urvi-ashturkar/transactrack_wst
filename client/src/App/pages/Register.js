import React, { Component } from "react";
import {Redirect, useHistory} from "react-router-dom";
import {Row, Col} from "reactstrap";
import { validateFields } from "../Validation";
import classnames from "classnames";
import axios from "axios";
import Login from "./Login";
import cover from "../reg_cover.jpg";

const initialState = {
  redirect: false,
  mis: {
    value: "",
    validateOnChange: false,
    error: "",
  },
  first_name: {
    value: "",
    validateOnChange: false,
    error: "",
  },
  last_name: {
    value: "",
    validateOnChange: false,
    error: "",
  },
  position: {
    value: "",
    validateOnChange: false,
    error: "",
  },
  portfolio: {
    value: "",
    validateOnChange: false,
    error: "",
  },
  password: {
    value: "",
    validateOnChange: false,
    error: "",
  },
  confirm_password: {
    value: "",
    validateOnChange: false,
    error: "",
  },
  submitCalled: false,
  allFieldsValidated: false,
};

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  };

  setRedirect = () => {
    this.setState({
      redirect: true
    })
  }
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to='/login' />
    }
  }

  handleNotFocus(validationFunc, evt) {
    const field = evt.target.name;

    if (
      this.state[field]["validateOnChange"] === false &&
      this.state.submitCalled === false
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
    const {
      mis,
      first_name,
      last_name,
      position,
      portfolio,
      password,
      confirm_password,
    } = this.state;
    const misError = validateFields.validateMis(mis.value);
    const first_nameError = validateFields.validateFirstName(first_name.value);
    const last_nameError = validateFields.validateLastName(last_name.value);
    const positionError = validateFields.validatePosition(position.value);
    const portfolioError = validateFields.validatePortfolio(
      portfolio.value,
      position.value
    );
    const passwordError = validateFields.validatePassword(password.value);
    const confirm_passwordError = validateFields.validateConfirmPassword(
      confirm_password.value,
      password.value
    );
    if (
      [
        misError,
        first_nameError,
        last_nameError,
        positionError,
        portfolioError,
        passwordError,
        confirm_passwordError,
      ].every((e) => e === false)
    ) {
      // no errors. Submit the form

      this.setState({ ...initialState, allFieldsValidated: true });
      axios
        .post("http://localhost:5000/register", this.state)
        .then((res) => {
          if(res.status == 400){
            alert("MIS already exists.\n");
          }
          // console.log("axios success" + res);
          else{
            this.setRedirect();
          }
          
        })
        .catch((err) => {
          console.log("fail" + err);
          alert("MIS already exists.\n");
        });
    } else {
      // update the state with errors
      this.setState((state) => ({
        mis: {
          ...state.mis,
          validateOnChange: true,
          error: misError,
        },
        first_name: {
          ...state.first_name,
          validateOnChange: true,
          error: first_nameError,
        },
        last_name: {
          ...state.last_name,
          validateOnChange: true,
          error: last_nameError,
        },
        position: {
          ...state.position,
          validateOnChange: true,
          error: positionError,
        },
        portfolio: {
          ...state.portfolio,
          validateOnChange: true,
          error: portfolioError,
        },
        password: {
          ...state.password,
          validateOnChange: true,
          error: passwordError,
        },
        confirm_password: {
          ...state.confirm_password,
          validateOnChange: true,
          error: confirm_passwordError,
        },
      }));
    }
  }

  render() {
    const {
      mis,
      first_name,
      last_name,
      position,
      portfolio,
      password,
      confirm_password,
      allFieldsValidated,
    } = this.state;

    return (
      <div className="App">
        {this.renderRedirect()}
        <main role="main" class="container">
          <div className="row" id="reg-content">
            <div className="col-12 col-md-6">
              <img src={cover} id="cover" alt="graphic" width="100%" />
            </div>

            <div className="content-section col-12 col-md-6">
              <form onSubmit={(evt) => this.handleSubmit(evt)}>
                <fieldset className="form-group">
                  <legend className="border-bottom mb-4">Create an Account</legend>
                    <div className="form-group row">
                      {/* Mis field */}
                      <div className="col-12">
                        <label>College-issued MIS ID</label>

                        {/* <input type="text" name="name" onChange={this.handleChange} /> */}
                        <input
                          type="text"
                          name="mis"
                          value={mis.value}
                          className={classnames(
                            "form-control",
                            { "is-valid": mis.error === false },
                            { "is-invalid": mis.error }
                          )}
                          onChange={(evt) =>
                            this.handleChange(validateFields.validateMis, evt)
                          }
                          onNotFocus={(evt) =>
                            this.handleNotFocus(validateFields.validateMis, evt)
                          }
                        />
                        <div className="invalid-feedback">{mis.error}</div>
                      </div>
                    </div>

                    <div className="form-group row">
                      {/* First name field */}
                      <div className="col-12 col-sm-6">
                        <label>First Name</label>
                        <input
                          type="text"
                          name="first_name"
                          value={first_name.value}
                          className={classnames(
                            "form-control",
                            { "is-valid": first_name.error === false },
                            { "is-invalid": first_name.error }
                          )}
                          onChange={(evt) =>
                            this.handleChange(validateFields.validateFirstName, evt)
                          }
                          onNotFocus={(evt) =>
                            this.handleNotFocus(
                              validateFields.validateFirstName,
                              evt
                            )
                          }
                        />
                        <div className="invalid-feedback">{first_name.error}</div>
                      </div>

                      {/* Last name field */}
                      <div className="col-12 col-sm-6">
                        <label>Last Name</label>
                        <input
                          type="text"
                          name="last_name"
                          value={last_name.value}
                          className={classnames(
                            "form-control",
                            { "is-valid": last_name.error === false },
                            { "is-invalid": last_name.error }
                          )}
                          onChange={(evt) =>
                            this.handleChange(validateFields.validateLastName, evt)
                          }
                          onNotFocus={(evt) =>
                            this.handleNotFocus(
                              validateFields.validateLastName,
                              evt
                            )
                          }
                        />
                        <div className="invalid-feedback">{last_name.error}</div>
                      </div>
                    </div>

                    <div className="form-group row">
                      {/* Position field */}
                      <div className="col-12 col-sm-6">
                        <label>Your role in the team</label>
                        <select
                          name="position"
                          className={classnames(
                            "form-control",
                            { "is-valid": position.error === false },
                            { "is-invalid": position.error }
                          )}
                          onChange={(evt) =>
                            this.handleChange(validateFields.validatePosition, evt)
                          }
                          onNotFocus={(evt) =>
                            this.handleNotFocus(
                              validateFields.validatePosition,
                              evt
                            )
                          }
                        >
                          <option value=" "> </option>
                          <option value="Coordinator">Coordinator</option>
                          <option value="Portfolio Head">Portfolio Head</option>
                          <option value="Secretary">Secretary</option>
                        </select>
                        <div className="invalid-feedback">{position.error}</div>
                      </div>

                      {/* Portfolio field */}
                      <div className="col-12 col-sm-6">
                        <label>Portfolio</label>
                        <select
                          name="portfolio"
                          className={classnames(
                            "form-control",
                            { "is-valid": portfolio.error === false },
                            { "is-invalid": portfolio.error }
                          )}
                          onChange={(evt) =>
                            this.handleChange(validateFields.validatePortfolio, evt)
                          }
                          onNotFocus={(evt) =>
                            this.handleNotFocus(
                              validateFields.validatePortfolio,
                              evt
                            )
                          }
                        >
                          <option value=" "> </option>
                          <option value="Events">Events</option>
                          <option value="Finance">Finance</option>
                          <option value="Design">Design</option>
                          <option value="Media">Media</option>
                          <option value="Accounts">Accounts</option>
                          <option value="COG">COG</option>
                          <option value="Publicity">Publicity</option>
                          <option value="Web">Web</option>
                          <option value="Documentation">Documentation</option>
                          <option value="Infrastructure">Infrastructure</option>
                          <option value="Logistics">Logistics</option>
                          <option value="Security">Security</option>
                        </select>
                        <div className="invalid-feedback">{portfolio.error}</div>
                      </div>
                    </div>

                    <div className="form-group row">
                      {/* Password field */}
                      <div className="col-12 col-sm-6">
                        <label>Password</label>
                        <input
                          type="password"
                          name="password"
                          value={password.value}
                          className={classnames(
                            "form-control",
                            { "is-valid": password.error === false },
                            { "is-invalid": password.error }
                          )}
                          onChange={(evt) =>
                            this.handleChange(validateFields.validatePassword, evt)
                          }
                          onNotFocus={(evt) =>
                            this.handleNotFocus(
                              validateFields.validatePassword,
                              evt
                            )
                          }
                        />
                        <div className="invalid-feedback">{password.error}</div>
                      </div>

                      {/* Confirm Password field */}
                      <div className="col-12 col-sm-6">
                        <label>Re-enter Password</label>
                        <input
                          type="password"
                          name="confirm_password"
                          value={confirm_password.value}
                          className={classnames(
                            "form-control",
                            { "is-valid": confirm_password.error === false },
                            { "is-invalid": confirm_password.error }
                          )}
                          onChange={(evt) =>
                            this.handleChange(
                              validateFields.validateConfirmPassword,
                              evt
                            )
                          }
                          onNotFocus={(evt) =>
                            this.handleNotFocus(
                              validateFields.validateConfirmPassword,
                              evt
                            )
                          }
                        />
                        <div className="invalid-feedback">
                          {confirm_password.error}
                        </div>
                      </div>
                    </div>

                </fieldset>
                <div className="form-group">
                  <button
                    type="submit"
                    className="btn btn-info"
                    onMouseDown={() => this.setState({ submitCalled: true })}
                  >
                    Sign Up
                  </button>
                </div>

                <div class="border-top pt-3">
                  <small class="text-muted">
                    Already Have An Account?{" "}
                    <a class="ml-2" href="/login">
                      Sign In
                    </a>
                  </small>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default Register;
