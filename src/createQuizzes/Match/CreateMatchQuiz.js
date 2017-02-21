import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import MatchQuizItem from './MatchQuizItem';

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
      currentID: 2,
      renderChild: true,
      test: true,
      // createItems: [this.renderItem(0), this.renderItem(1)],
    };

    this.createMatchQuiz = { left: ['', ''], right: ['', ''], default: 'Choose an option!' };
    this.createItems = [this.renderItem(0), this.renderItem(1)];

    this.isReviewMode = this.isReviewMode.bind(this);
    this.isResultMode = this.isResultMode.bind(this);
    this.addMatchElement = this.addMatchElement.bind(this);
    this.deleteMatchElement = this.deleteMatchElement.bind(this);
  }

  updateItems(newItems) {
    this.setState({ items: newItems });
  }

  isReviewMode() {
    const newState = !this.state.reviewState;
    this.setState({ reviewState: newState });
  }

  isResultMode() {
    const newState = !this.state.resultState;
    this.setState({ resultState: newState });
  }

  /* Function called everytime when user types in textarea */
  handleTextareaChange(e) {
    const target = e.target;
    const name = target.name;
    const id = target.id;
    const value = target.value;

    // Update the LEFT item with value of textarea
    if (name === this.state.leftTextareaName) {
      this.createMatchQuiz.left[id] = value;
      console.log(this.createMatchQuiz.left);
    }

    // Update the RIGHT item with value of textarea
    if (name === this.state.rightTextareaName) {
      this.createMatchQuiz.right[id] = value;
      console.log(this.createMatchQuiz.right);
    }

    if (name === this.state.defaultTextareaName) {
      this.createMatchQuiz.default = value;
      console.log(this.createMatchQuiz.default);
    }

    // Testing purposes
    // console.log(this.createMatchQuiz);
  }

  addMatchElement() {
    const newItemsArray = this.createItems;
    const id = this.state.currentID;
    const newItem = this.renderItem(id);
    const newID = id + 1;
    newItemsArray.push(newItem);
    this.createItems = newItemsArray;
    this.setState({ currentID: newID });
  }

  deleteMatchElement(index) {
    const newItemsArray = this.createItems;
    const ind = parseInt(index, 10);
    // console.log(newItemsArray);

    if (newItemsArray[ind]) {
      newItemsArray[ind] = null;
      // newItemsArray.splice(ind, 1);
    }
    console.log(newItemsArray);
    this.createItems = newItemsArray;

    // this.setState({ createItems: newItemsArray });
  }

  renderItem(itemID) {
    this.item = (
      <MatchQuizItem
        id={itemID}
        key={itemID}
        reviewState={this.state.reviewState}
        resultState={this.state.resultState}
        leftTextareaName={this.state.leftTextareaName}
        rightTextareaName={this.state.rightTextareaName}
        deleteMatchElement={index => this.deleteMatchElement(index)}
        onChange={e => this.handleTextareaChange(e)}
      />
    );
    return this.item;
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
    const items = this.createItems;
    console.log('RENDER', items);

    const createMatchQuiz = (
      <div className="createMatchQuizContainer">
        <div className="leftColumn">
          <h3> Left Items </h3>
        </div>

        <div className="rightColumn" >
          <h3> Right Items </h3>
        </div>

        <div className="createMatchItems">
          { items }
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
                onChange={e => this.handleTextareaChange(e)}
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
