import React from "react";
import cover from "../login_cover.jpg";
import axios from "axios";
import {reactLocalStorage} from 'reactjs-localstorage';
import {useHistory} from "react-router-dom";
import "../App.css";

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
        const thisUser = res.data[0];
        {/*setUserDetails({...user_details, thisUser});*/}
        // con
        if(res.data[0].message === "Authentication Successful.\n") {
          reactLocalStorage.setObject("user_details", thisUser);
          history.push("/dashboard");
        }
        else {
          alert(res.data[0].message);
        }
      })
      .catch((err) => {
        console.log("fail" + err);
      });
    e.target.mis.value = "";
    e.target.password.value = "";

  }

  return (
    <div className="App">
      <main role="main" className="container">
      <h1 className="title">TransacTrack</h1>
        <div className="row" id="login-content">
          <div className="col-12 col-md-8">
            <img src={cover} id="cover" alt="graphic" width="100%" />
          </div>

          <div className="content-section col-12 col-md-4">
            <form onSubmit={handleSubmit}>
              <fieldset className="form-group">
                <legend className="border-bottom mb-4">Log In</legend><br/>
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
                  className="btn btn-blue"
                >
                  Submit
                </button>
              </div><br/>
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
