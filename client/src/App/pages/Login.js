import React, { Component } from "react";
import { Link } from "react-router-dom";
import cover from "../cover.jpg"
import { validateFields } from '../Validation';
import classnames from 'classnames';

const initialState = {
  mis: {
    value: '',
    validateOnChange: false,
    error: ''
  },
  password: {
    value: '',
    validateOnChange: false,
    error: ''
  },
  submitCalled: false,
  allFieldsValidated: false
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleNotFocus(validationFunc, evt) {
    const field = evt.target.name;

    if (
      this.state[field]['validateOnChange'] === false &&
      this.state.submitCalled === false
    ) {
      this.setState(state => ({
        [field]: {
          ...state[field],
          validateOnChange: true,
          error: validationFunc(state[field].value)
        }
      }));
    }
    return;
  }

  handleChange(validationFunc, evt) {
    const field = evt.target.name;
    const fieldVal = evt.target.value;
    this.setState(state => ({
      [field]: {
        ...state[field],
        value: fieldVal,
        error: state[field]['validateOnChange'] ? validationFunc(fieldVal) : ''
      }
    }));
  }

  handleSubmit(evt) {
    evt.preventDefault();
    // validate all fields
    const { mis, password } = this.state;
    const misError = validateFields.validateMis(mis.value);
    const passwordError = validateFields.validatePassword(password.value);
    if ([misError, passwordError].every(e => e === false)) {
      // no errors. Submit the form
      console.log('success');
      this.setState({ ...initialState, allFieldsValidated: true });
    } else {
      // update the state with errors
      this.setState(state => ({
        mis: {
          ...state.mis,
          validateOnChange: true,
          error: misError
        },
        password: {
          ...state.password,
          validateOnChange: true,
          error: passwordError
        }
      }));
    }
  }

  render() {
    const { mis, password, allFieldsValidated } = this.state;

    return (
      <div className="App">
        <div className="row">

          <div className="col-md-1"></div>

          <div className="col-12 col-md-6">
            <img src={cover} id="cover" alt="team" width="100%"/>
          </div>

          <div className="content-section col-12 col-md-3">

            {allFieldsValidated && (
              <p className="text-success text-center">
                Go to dashboard from here.
              </p>
            )}

            <form onSubmit={evt => this.handleSubmit(evt)}>
              <fieldset className="form-group">
                <legend className="border-bottom mb-4">Log In</legend>
                {/* Mis field */}
                <div className="form-group">
                  <label>MIS</label>
                  <input
                    type="text"
                    name="mis"
                    value={mis.value}
                    placeholder="Enter college-issued MIS"
                    className={classnames(
                      'form-control',
                      { 'is-valid': mis.error === false },
                      { 'is-invalid': mis.error }
                    )}
                    onChange={evt =>
                      this.handleChange(validateFields.validateMis, evt)
                    }
                    onNotFocus={evt =>
                      this.handleNotFocus(validateFields.validateMis, evt)
                    }
                  />
                  <div className="invalid-feedback">{mis.error}</div>
                </div>

                {/* Password field */}
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={password.value}
                    placeholder="Enter your password"
                    className={classnames(
                      'form-control',
                      { 'is-valid': password.error === false },
                      { 'is-invalid': password.error }
                    )}
                    onChange={evt =>
                      this.handleChange(validateFields.validatePassword, evt)
                    }
                    onNotFocus={evt =>
                      this.handleNotFocus(validateFields.validatePassword, evt)
                    }
                  />
                  <div className="invalid-feedback">{password.error}</div>
                </div>
              </fieldset>
              <div className="form-group">
                <button type="submit" className="btn btn-info" onMouseDown={() => this.setState({ submitCalled: true })}>
                  Submit
                </button>
              </div>
              <small className="text-muted ml-2">
                <a href="#">Forgot Password?</a>
              </small>
            </form>
            <div className="border-top pt-3">
              <small className="text-muted">
                New to the team? <a className="ml-2" href="#">Sign Up Now</a>
              </small>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Login;
