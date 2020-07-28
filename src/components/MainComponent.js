import React, { Component } from 'react';
import Home from './HomeComponent';
import Menu from './MenuComponent';
import Dishdetail from './DishdetailComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import { DISHES } from '../shared/dishes';
import { Switch, Route, Redirect } from 'react-router-dom';


class Main extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dishes: DISHES,
    };
  }

  render() {

    const HomePage = () => {    //could also be done inline like Menu.
      return(
        <Home />
      );
    }

    return (
      <div>
        <Header />
        <Switch>
          <Route path="/home" component={HomePage} />   //if url ending in "/home", render view of HomePage component.
          <Route exact path="/menu" component={() => <Menu dishes={this.state.dishes} />} />    //Inline definition of component. Didn't say component={Menu} because wanted to pass props.
          <Redirect to="/home" />   //if path does not match any of the above, go here.
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default Main;
