import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Button, Modal, ModalBody, ModalHeader, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => (val) && (val.length >= len);

class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }

  handleSubmit(values) {
    this.toggleModal();
    console.log("Current state is: " + JSON.stringify(values))
    alert("Current state is: " + JSON.stringify(values))
  }

  render() {
    return(
      <div>
        <div>
          <Button outline onClick={this.toggleModal} className="mb-5">
            <span className="fa fa-pencil fa-lg"></span> Submit Comment
          </Button>
        </div>
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
          <ModalBody>
            <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
              <Row className="form-group ml-1 mr-1">
                <Label htmlFor="rating">Rating</Label>
                <Control.select model=".rating" name="rating"
                    className="form-control" >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </Control.select>
              </Row>
              <Row className="form-group ml-1 mr-1">
                <Label htmlFor="name">Your Name</Label>
                <Control.text model=".author" id="name" name="name"
                  placeholder="Your Name"
                  className="form-control"
                  validators={{
                    required, minLength: minLength(3), maxLength: maxLength(15)
                  }} />
                <Errors
                  className="text-danger"
                  model=".author"
                  show="touched"
                  messages={{
                    required: 'Required. ',
                    minLength: 'Must be greater than 2 characters.',
                    maxLength: 'Must be 15 characters or less.'
                  }}
                />
              </Row>
              <Row className="form-group ml-1 mr-1">
                <Label htmlFor="comment">Comment</Label>
                 <Control.textarea model=".comment" id="comment" name="comment"
                    rows="6"
                    className="form-control" />
              </Row>
              <Button type="submit" color="primary">Submit</Button>
            </LocalForm>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}



  function RenderComments({comments}) {
    const dishComment = comments.map((commentItem) => {
      return (
        <div key={commentItem.id} className="col-12 col-md-5 m-1">
          <ul className="list-unstyled">
            <li>{commentItem.comment}</li>
            <li>-- {commentItem.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(commentItem.date)))}</li>
          </ul>
        </div>
      );
    });
    if (comments != null) {
      return(
        <div>
          <h4>Comments</h4>
          {dishComment}
          <CommentForm/>
        </div>
      );
    }
    else {
      return(
        <div>
          <CommentForm/>
        </div>
      );
    }
  }

  function RenderDish({dish}) {
    return(
      <div className="col-12 col-md-5 m-1">
        <Card>
          <CardImg top src={dish.image} alt={dish.name} />
          <CardBody>
            <CardTitle>{dish.name}</CardTitle>
            <CardText>{dish.description}</CardText>
          </CardBody>
        </Card>
      </div>
    );
  }

  const Dishdetail = (props) => {

    if (props.dish != null) {
      return(
        <div className="container">
          <div className="row">
            <Breadcrumb>
              <BreadcrumbItem><Link to='/menu'>Menu</Link></BreadcrumbItem>
              <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
            </Breadcrumb>
            <div className="col-12">
              <h3>{props.dish.name}</h3>
              <hr />
            </div>
          </div>
          <div className="row">
            <RenderDish dish={props.dish} />
            <RenderComments comments={props.comments} />
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

export default Dishdetail;
