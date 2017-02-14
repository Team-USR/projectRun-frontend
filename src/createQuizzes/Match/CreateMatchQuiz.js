import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import '../../style/Match/CreateMatchQuiz.css';

export default class CreateMatchQuiz extends Component {
  constructor() {
    super();
    this.state = {
      reviewState: false,
      resultState: false,
      leftTextareaName: 'leftItems',
      rightTextareaName: 'rightItems',
      defaultTextareaName: 'defaultOptionText',
    };

    this.createMatchQuiz = { left: [], right: [], default: 'Choose an option!' };

    this.isReviewMode = this.isReviewMode.bind(this);
    this.isResultMode = this.isResultMode.bind(this);
    this.onTextareaChange = this.onTextareaChange.bind(this);
  }

  /* Function called everytime when user types in textarea */
  onTextareaChange(e) {
    const target = e.nativeEvent.target;
    const name = target.name;
    const id = target.id;
    const value = target.value;

    // Update the LEFT item with value of textarea
    if (name === this.state.leftTextareaName) {
      this.createMatchQuiz.left[id] = value;
    }

    // Update the RIGHT item with value of textarea
    if (name === this.state.rightTextareaName) {
      this.createMatchQuiz.right[id] = value;
    }

    // Update the DEFAULT item with value of textarea
    if (name === this.state.defaultTextareaName) {
      this.createMatchQuiz.default = value;
    }

    // Testing purposes
    // console.log(this.createMatchQuiz);
  }

  isReviewMode() {
    const newState = !this.state.reviewState;
    this.setState({ reviewState: newState });
  }

  isResultMode() {
    const newState = !this.state.resultState;
    this.setState({ resultState: newState });
  }

  renderCreateItems(n) {
    this.n = n;
    const createItems = [];
    for (let i = 0; i < n; i += 1) {
      createItems[i] = (
        <div className="quizItem" id={i} key={i}>
          <div className="itemIndex">
            <label htmlFor="item">{ i + 1 }</label>
          </div>
          <textarea
            id={i}
            disabled={this.state.reviewState}
            name={this.state.leftTextareaName} className="itemTexarea leftTextarea"
            rows="3" cols="30"
            onChange={this.onTextareaChange}
          />
          <textarea
            id={i}
            disabled={this.state.reviewState}
            name={this.state.rightTextareaName} className="itemTexarea rightTextarea"
            rows="3" cols="30"
            onChange={this.onTextareaChange}
          />
        </div>
      );
    }

    return createItems;
  }

  renderSubmitPanel() {
    const reviewState = this.state.reviewState;
    const resultState = this.state.resultState;

    if (reviewState && !resultState) {
      return (
        <div className="submitPanel">
          <Button className="submitButton" onClick={this.isReviewMode}>BACK</Button>
          <Button className="submitButton" onClick={this.isResultMode}>SUBMIT</Button>
        </div>
      );
    }
    if (!reviewState && !resultState) {
      return (
        <div className="submitPanel">
          <Button className="submitButton" onClick={this.isReviewMode}> FINISH</Button>
        </div>
      );
    }

    return (
      <div className="submitPanel">
        <h3>Test Submitted Sucessfully!</h3>
      </div>
    );
  }

  render() {
    const items = this.renderCreateItems(5);
    const createMatchQuiz = (
      <div className="createMatchQuizContainer">
        <div className="leftColumn">
          <h3> Left Items </h3>
        </div>

        <div className="rightColumn" >
          <h3> Right Items </h3>
        </div>

        <div className="createMatchItems">
          { items.map(obj => obj) }
        </div>

        <div className="defaultOption">
          Default:
          <textarea
            disabled={this.state.reviewState}
            className="itemTexarea" name={this.state.defaultTextareaName}
            rows="3" cols="30"
            defaultValue={this.createMatchQuiz.default}
            onChange={this.onTextareaChange}
          />
        </div>

        <br /><br /><br />
        { /* Display Buttons section */ }
        { this.renderSubmitPanel() }

      </div>
    );

    return createMatchQuiz;
  }

}
