import React, { Component } from "react";
import { validateFields } from "../Validation";
import classnames from "classnames";
import axios from "axios";

const initialState = {
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
  email: {
    value: "",
    validateOnChange: false,
    error: "",
  },
  phone: {
    value: "",
    validateOnChange: false,
    error: "",
  },
  dob: {
    value: "",
    validateOnChange: false,
    error: "",
  },
  cgpa: {
    value: "",
    validateOnChange: false,
    error: "",
  },
  is_hostelite: {
    value: "",
    validateOnChange: false,
    error: "",
  },
  join_date: {
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
      email,
      phone,
      dob,
      cgpa,
      is_hostelite,
      join_date,
      position,
      portfolio,
      password,
      confirm_password,
    } = this.state;
    const misError = validateFields.validateMis(mis.value);
    const first_nameError = validateFields.validateFirstName(first_name.value);
    const last_nameError = validateFields.validateLastName(last_name.value);
    const emailError = validateFields.validateEmail(email.value);
    const phoneError = validateFields.validatePhone(phone.value);
    const dobError = validateFields.validateDob(dob.value);
    const cgpaError = validateFields.validateCgpa(cgpa.value);
    const is_hosteliteError = validateFields.validateIsHostelite(
      is_hostelite.value
    );
    const join_dateError = validateFields.validateJoinDate(join_date.value);
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
        emailError,
        phoneError,
        dobError,
        cgpaError,
        is_hosteliteError,
        join_dateError,
        positionError,
        portfolioError,
        passwordError,
        confirm_passwordError,
      ].every((e) => e === false)
    ) {
      // no errors. Submit the form

      this.setState({ ...initialState, allFieldsValidated: true });
      console.log("success");
      axios
        .post("http://localhost:5000/register", this.state)
        .then((res) => {
          console.log("axios success" + res);
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
        email: {
          ...state.email,
          validateOnChange: true,
          error: emailError,
        },
        phone: {
          ...state.phone,
          validateOnChange: true,
          error: phoneError,
        },
        dob: {
          ...state.dob,
          validateOnChange: true,
          error: dobError,
        },
        cgpa: {
          ...state.cgpa,
          validateOnChange: true,
          error: cgpaError,
        },
        is_hostelite: {
          ...state.is_hostelite,
          validateOnChange: true,
          error: is_hosteliteError,
        },
        join_date: {
          ...state.join_date,
          validateOnChange: true,
          error: join_dateError,
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
      email,
      phone,
      dob,
      cgpa,
      is_hostelite,
      join_date,
      position,
      portfolio,
      password,
      confirm_password,
      allFieldsValidated,
    } = this.state;

    return (
      <div className="App">
        <main role="main" class="container" id="form-wrapper">
          <div class="row">
            <div class="col-md-3"></div>
            <div class="content-section col-md-6" id="form-card">
              {allFieldsValidated && (
                <p className="text-success text-center">
                  Go to login from here.
                </p>
              )}

              <form onSubmit={(evt) => this.handleSubmit(evt)}>
                <fieldset className="form-group">
                  <legend className="border-bottom mb-4">Join the Team</legend>
                  {/* Mis field */}
                  <div className="form-group">
                    <label>MIS ID</label>

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

                  {/* First name field */}
                  <div className="form-group">
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
                  <div className="form-group">
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

                  {/* Email field */}
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="text"
                      name="email"
                      value={email.value}
                      className={classnames(
                        "form-control",
                        { "is-valid": email.error === false },
                        { "is-invalid": email.error }
                      )}
                      onChange={(evt) =>
                        this.handleChange(validateFields.validateEmail, evt)
                      }
                      onNotFocus={(evt) =>
                        this.handleNotFocus(validateFields.validateEmail, evt)
                      }
                    />
                    <div className="invalid-feedback">{email.error}</div>
                  </div>

                  {/* Phone no field */}
                  <div className="form-group">
                    <label>Phone no.</label>
                    <input
                      type="text"
                      name="phone"
                      value={phone.value}
                      className={classnames(
                        "form-control",
                        { "is-valid": phone.error === false },
                        { "is-invalid": phone.error }
                      )}
                      onChange={(evt) =>
                        this.handleChange(validateFields.validatePhone, evt)
                      }
                      onNotFocus={(evt) =>
                        this.handleNotFocus(validateFields.validatePhone, evt)
                      }
                    />
                    <div className="invalid-feedback">{phone.error}</div>
                  </div>

                  {/* DOB field */}
                  <div className="form-group">
                    <label>DOB</label>
                    <input
                      type="date"
                      name="dob"
                      placeholder="YYYY-MM-DD"
                      value={dob.value}
                      className={classnames(
                        "form-control",
                        { "is-valid": dob.error === false },
                        { "is-invalid": dob.error }
                      )}
                      onChange={(evt) =>
                        this.handleChange(validateFields.validateDob, evt)
                      }
                      onNotFocus={(evt) =>
                        this.handleNotFocus(validateFields.validateDob, evt)
                      }
                    />
                    <div className="invalid-feedback">{dob.error}</div>
                  </div>

                  {/* CGPA field */}
                  <div className="form-group">
                    <label>Current CGPA</label>
                    <input
                      type="text"
                      name="cgpa"
                      pattern="^\d*(\.\d{0,2})?$"
                      value={cgpa.value}
                      className={classnames(
                        "form-control",
                        { "is-valid": cgpa.error === false },
                        { "is-invalid": cgpa.error }
                      )}
                      onChange={(evt) =>
                        this.handleChange(validateFields.validateCgpa, evt)
                      }
                      onNotFocus={(evt) =>
                        this.handleNotFocus(validateFields.validateCgpa, evt)
                      }
                    />
                    <div className="invalid-feedback">{cgpa.error}</div>
                  </div>

                  {/* Is hostelite field */}
                  <div className="form-group">
                    <label>I reside in COEP hostel.</label>
                    <input
                      type="checkbox"
                      name="is_hostelite"
                      id="checkbox"
                      style={{ width: 20, height: 20, display: "inline" }}
                      value={is_hostelite.value}
                      className={classnames(
                        "form-control",
                        { "is-valid": is_hostelite.error === false },
                        { "is-invalid": is_hostelite.error }
                      )}
                      onChange={(evt) =>
                        this.handleChange(
                          validateFields.validateIsHostelite,
                          evt
                        )
                      }
                      onNotFocus={(evt) =>
                        this.handleNotFocus(
                          validateFields.validateIsHostelite,
                          evt
                        )
                      }
                    />
                    <div className="invalid-feedback">{is_hostelite.error}</div>
                  </div>

                  {/* Join date field */}
                  <div className="form-group">
                    <label>Date of joining the team</label>
                    <input
                      type="date"
                      name="join_date"
                      placeholder="YYYY-MM-DD"
                      value={join_date.value}
                      className={classnames(
                        "form-control",
                        { "is-valid": join_date.error === false },
                        { "is-invalid": join_date.error }
                      )}
                      onChange={(evt) =>
                        this.handleChange(validateFields.validateJoinDate, evt)
                      }
                      onNotFocus={(evt) =>
                        this.handleNotFocus(
                          validateFields.validateJoinDate,
                          evt
                        )
                      }
                    />
                    <div className="invalid-feedback">{join_date.error}</div>
                  </div>

                  {/* Position field */}
                  <div className="form-group">
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
                  <div className="form-group">
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

                  {/* Password field */}
                  <div className="form-group">
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
                  <div className="form-group">
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
