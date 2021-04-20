import React, { Component } from "react";
import { Route, Switch, BrowserRouter, withRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

class App extends Component {
  render() {
    const App = () => (
      <BrowserRouter forceRefresh>
        <Switch>
          <Route exact path="/" component={withRouter(Login)} />
          <Route exact path="/login" component={withRouter(Login)} />
          <Route path="/register" component={withRouter(Register)} />
          <Route path="/dashboard" component={withRouter(Dashboard)} />
        </Switch>
      </BrowserRouter>
    );
    return (
        <App />
    );
  }
}

export default App;
