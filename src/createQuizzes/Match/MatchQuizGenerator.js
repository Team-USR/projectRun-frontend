import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { MatchQuizItem } from './index';
import '../../style/createQuizzes/Match/MatchQuizGenerator.css';

export default class MatchQuizGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewState: false,
      resultState: false,
      leftTextareaName: 'leftItems',
      rightTextareaName: 'rightItems',
      defaultTextareaName: 'defaultOptionText',
      quizTitlePlaceHolder: 'Insert a title or a question for this quiz',
      leftTextareaPlaceholder: 'Write a LEFT item',
      rightTextareaPlaceHolder: 'Write its corresponding RIGHT answer',
      defaultTextareaPlaceHolder: 'Write a default option for dropdowns',
      currentID: 2,
    };

    this.matchQuizTitle = '';
    this.createMatchQuiz = { left: ['', ''], right: ['', ''], default: 'Choose an option!' };
    this.createItems = [this.renderItem(0), this.renderItem(1)];

    this.isReviewMode = this.isReviewMode.bind(this);
    this.isResultMode = this.isResultMode.bind(this);
    this.addMatchElement = this.addMatchElement.bind(this);
    this.deleteMatchElement = this.deleteMatchElement.bind(this);
  }

  isReviewMode() {
    const newState = !this.state.reviewState;
    this.setState({ reviewState: newState });
  }

  isResultMode() {
    const newState = !this.state.resultState;
    this.setState({ resultState: newState });
  }

  /* Function called everytime when user types in Quiz Title Input */
  handleTitleInputChange(e) {
    const target = e.target;
    const value = target.value;
    this.matchQuizTitle = value;
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
      // console.log(this.createMatchQuiz.left);
    }

    // Update the RIGHT item with value of textarea
    if (name === this.state.rightTextareaName) {
      this.createMatchQuiz.right[id] = value;
      // console.log(this.createMatchQuiz.right);
    }

    if (name === this.state.defaultTextareaName) {
      this.createMatchQuiz.default = value;
      // console.log(this.createMatchQuiz.default);
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
    // console.log(newItemsArray);
    this.createItems = newItemsArray;

    // this.setState({ createItems: newItemsArray });
  }

  addMatchElementOptim() {
    const solCopy = this.state.createItems;
    solCopy.push('');
    this.setState({ createItems: solCopy });
    // console.log(this.state.createItems);
  }

  handleTextareaChangeOptim(e, index) {
    const solCopy = this.state.createItems;
    solCopy[index] = e.target.value;
    this.setState({ createItems: solCopy });
    // console.log(this.state.createItems);
  }

  deleteMatchElementOptim(index) {
    const solCopy = this.state.createItems;
    solCopy.splice(index, 1);
    this.setState({ createItems: solCopy });
    // console.log(this.state.createItems);
  }

  renderItemsOptim() {
    const renderedComponents = [];
    this.state.createItems.map((value, index) => {
      const ind = index;
      renderedComponents.push(
        <MatchQuizItem
          key={`create_match_item_${ind}`}
          index={index}
          handleInputChange={(e, i) => this.handleInputChange(e, i)}
          value={value}
          removeSolution={i => this.removeSolution(i)}
        />,
      );
      return ('');
    },
    );
    return renderedComponents;
  }

  renderItem(itemID) {
    this.item = (
      <MatchQuizItem
        id={itemID}
        key={itemID}
        reviewState={this.props.reviewState}
        resultState={this.props.resultsState}
        leftTextareaName={this.state.leftTextareaName}
        rightTextareaName={this.state.rightTextareaName}
        leftTextareaPlaceholder={this.state.leftTextareaPlaceholder}
        rightTextareaPlaceHolder={this.state.rightTextareaPlaceHolder}
        deleteMatchElement={index => this.deleteMatchElement(index)}
        onChange={e => this.handleTextareaChange(e)}
      />
    );
    return this.item;
  }

  render() {
    const items = this.createItems;
    // console.log('RENDER', items);

    const createMatchQuiz = (
      <div className="matchQuizGenerator">
        <div className="createMatchQuizTitle">
          <h3>Match question</h3>
          <b>Question: </b>
          <input
            type="text"
            name="matchQuizTitle"
            className="quizTitleInput"
            placeholder={this.state.quizTitlePlaceHolder}
            onChange={e => this.handleTitleInputChange(e)}
          />
        </div>
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
          <div className="addMoreItemsBtn">
            <Button className="" onClick={this.addMatchElement}> Add Match Element</Button>
          </div>

          <div className="">
            <div className="defaultOption">
              <textarea
                disabled={this.props.reviewState}
                name={this.state.defaultTextareaName}
                className="itemTexarea"
                placeholder={this.state.defaultTextareaPlaceHolder}
                rows="2" cols="25"
                defaultValue={this.createMatchQuiz.default}
                onChange={e => this.handleTextareaChange(e)}
              />
            </div>
          </div>
        </div>

      </div>
    );

    return createMatchQuiz;
  }
}

MatchQuizGenerator.propTypes = {
  reviewState: PropTypes.bool.isRequired,
  resultsState: PropTypes.bool.isRequired,
};
