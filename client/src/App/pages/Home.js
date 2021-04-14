import React, { Component } from "react";
import { Link } from "react-router-dom";

class Home extends Component {
  render() {
    return (
      <div className="App">
        <h1>Project Home</h1>
        {/* Link to Porfolio.js */}
        <Link to={"./portfolio"}>
          <button variant="raised">My Portfolios</button>
        </Link>
      </div>
    );
  }
}
export default Home;
