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
      size: 2,
      left: ['', ''],
      right: ['', ''],
    };

    this.createMatchQuiz = { left: ['', ''], right: ['', ''], default: 'Choose an option!' };

    this.isReviewMode = this.isReviewMode.bind(this);
    this.isResultMode = this.isResultMode.bind(this);
    this.onTextareaChange = this.onTextareaChange.bind(this);
    this.addMatchElement = this.addMatchElement.bind(this);
    this.deleteMatchElement = this.deleteMatchElement.bind(this);
  }
  componentDidUpdate() {
    this.renderCreateItems();
  }

  // componentDidMount() {
  //   console.log('componentDidMount');
  // }
  //
  // shouldComponentUpdate(nextProps, nextState) {
  //   // return a boolean value
  //   console.log('shouldComponentUpdate');
  //
  //   return true;
  // }
  //
  // componentWillUpdate(nextProps, nextState) {
  //     // perform any preparations for an upcoming update
  //   console.log('componentWillUpdate');
  // }

  /* Function called everytime when user types in textarea */
  onTextareaChange(e) {
    const target = e.nativeEvent.target;
    const name = target.name;
    const id = target.id;
    const value = target.value;

    // Update the LEFT item with value of textarea
    if (name === this.state.leftTextareaName) {
      this.createMatchQuiz.left[id] = value;
      // const x = this.state.left;
      // x[id] = value;
      // this.setState({ left: x });
    }

    // Update the RIGHT item with value of textarea
    if (name === this.state.rightTextareaName) {
      this.createMatchQuiz.right[id] = value;
      // this.right[id] = value;
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

  addMatchElement() {
    const newSize = this.state.size + 1;
    this.setState({ size: newSize });
    console.log('ADD');
  }

  deleteMatchElement(e) {
    const target = e.nativeEvent.target;
    const index = target.id;
    const newSize = this.state.size - 1;
    const leftArray = this.createMatchQuiz.left;
    const rightArray = this.createMatchQuiz.right;

    // const leftArray = this.state.left;
    // const rightArray = this.state.right;

    console.log(leftArray);

    leftArray.splice(index, 1);
    rightArray.splice(index, 1);

    this.createMatchQuiz.left = leftArray;
    this.createMatchQuiz.right = rightArray;

    console.log(leftArray);

    this.setState({ left: leftArray, right: rightArray });
    this.setState({ size: newSize });
    console.log('DELETE');
  }

  renderCreateItems() {
    const n = this.state.size;
    const locLeft = this.state.left;
    const locRight = this.state.right;
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
            defaultValue={locLeft[i]}
          />
          <textarea
            id={i}
            disabled={this.state.reviewState}
            name={this.state.rightTextareaName} className="itemTexarea rightTextarea"
            rows="3" cols="30"
            onChange={this.onTextareaChange}
            defaultValue={locRight[i]}
          />
          <div className="">
            <Button className="" id={i} onClick={this.deleteMatchElement}> X </Button>
          </div>
        </div>
      );
      // createItems[i].state = this.state.left[i];
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
          <Button className="submitButton" onClick={this.isReviewMode}>FINISH</Button>
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
    console.log('RENDER');
    const items = this.renderCreateItems();

    console.log(items[0]);

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

        <br />

        <div className="quizItem" id="deafultValue" key="defaultValue">
          <div className="leftColumn">
            <Button className="" onClick={this.addMatchElement}> Add Match Element</Button>
          </div>

          <div className="rightColumn">
            <div className="defaultOption">
              <textarea
                disabled={this.state.reviewState}
                className="itemTexarea" name={this.state.defaultTextareaName}
                rows="3" cols="30"
                defaultValue={this.createMatchQuiz.default}
                onChange={this.onTextareaChange}
              />
            </div>
          </div>
        </div>

        <br /><br /><br />
        { /* Display Buttons section */ }
        { this.renderSubmitPanel() }

      </div>
    );

    return createMatchQuiz;
  }

}
