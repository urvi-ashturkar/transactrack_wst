import React, { Component } from "react";
import axios from "axios";
class Portfolio extends Component {
  // Initialize the state
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    };
  }

  // Fetch the list on first mount
  componentDidMount() {
    this.getList();
  }

  // Retrieves the list of Portfolios from the Express app
  getList = () => {
    axios.get("http://localhost:5000/portfolio/").then((response) => {
      //console.log(response.data);
      const list = response.data;
      console.log(typeof list);
      this.setState({ list });
      console.log(list);
    });
  };

  render() {
    const { list } = this.state;
    return (
      <div className="App">
        <h1>List of Portfolios</h1>
        {/* Check to see if any Portfolios are found*/}
        {list.length ? (
          <div>
            {/* Render the list of Portfolios */}
            {list.map((item, index) => {
              return <div key={index}>{item.portfolio_name}</div>;
            })}
          </div>
        ) : (
          <div>
            <h2>No List Portfolios Found</h2>
          </div>
        )}
      </div>
    );
  }
}

export default Portfolio;
