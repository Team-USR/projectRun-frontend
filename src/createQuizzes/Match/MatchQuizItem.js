import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import '../../style/Match/CreateMatchQuiz.css';

export default class CreateMatchQuiz extends Component {
  constructor(props) {
    super();
    this.state = {
      render: props.render,
    };
    this.deleteMatchElement = this.deleteMatchElement.bind(this);
  }

  deleteMatchElement() {
    // console.log('delete');
    this.setState({ render: false });
  }
  render() {
    const item = (
      <div className="quizItem" id={0} key={0}>
        <div className="itemIndex">
          <label htmlFor="item">{ 1 + 1 }</label>
        </div>
        <textarea
          id={0}
          disabled={this.state.reviewState}
          name={this.state.leftTextareaName} className="itemTexarea leftTextarea"
          rows="3" cols="30"
          onChange={this.handleTextareaChange}
          defaultValue={this.props.defaultValue}
        />
        <textarea
          id={0}
          disabled={this.state.reviewState}
          name={this.state.rightTextareaName} className="itemTexarea rightTextarea"
          rows="3" cols="30"
          onChange={this.handleTextareaChange}
          defaultValue={this.props.defaultValue}
        />
        <div className="">
          <Button className="" id={0} onClick={this.deleteMatchElement}> X </Button>
        </div>
      </div>
    );

    if (this.state.render) {
      return item;
    }
    return null;
  }
}
