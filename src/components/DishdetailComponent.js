import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle } from 'reactstrap';

class Dishdetail extends Component {

  componentDidMount() {
    console.log('Dishdetail component componentDidMount invoked.');
  }

  componentDidUpdate() {
    console.log('Dishdetail component componentDidUpdate invoked.');
  }

  renderComments(commentsArray) {
    const dishComment = this.props.dish.comments.map((commentItem) => {
      return (
        <div key={commentItem.id} className="col-12 col-md-5 m-1">
          <ul className="list-unstyled">
            <li>{commentItem.comment}</li>
            <li>-- {commentItem.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(commentItem.date)))}</li>
          </ul>
        </div>
      );
    });
    if (commentsArray != null) {
      return(
        <div>
          <h4>Comments</h4>
          {dishComment}
        </div>
      );
    }
    else {
      return(
        <div></div>
      );
    }
  }

  renderDish(dish) {
    return(
      <div className="col-12 col-md-5 m-1">
        <Card>
          <CardImg width="100%" src={dish.image} alt={dish.name} />
          <CardBody>
            <CardTitle>{dish.name}</CardTitle>
            <CardText>{dish.description}</CardText>
          </CardBody>
        </Card>
      </div>
    );
  }

  render() {
    console.log('Dishdetail component render invoked.');

    if (this.props.dish != null) {
      return(
        <div className="container">
          <div className="row">
            {this.renderDish(this.props.dish)}
            {this.renderComments(this.props.dish.comments)}
          </div>
        </div>
      );
    }
    else {
      return(
        <div></div>
      );
    }
  }

}

export default Dishdetail;
