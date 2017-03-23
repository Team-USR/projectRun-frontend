import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { MatchQuizItem } from './index';

export default class MatchQuizGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftTextareaName: 'leftItems',
      rightTextareaName: 'rightItems',
      defaultTextareaName: 'defaultOptionText',
      quizTitlePlaceHolder: 'Insert a title or a question for this quiz',
      leftTextareaPlaceholder: 'Write a LEFT item',
      rightTextareaPlaceHolder: 'Write its corresponding RIGHT answer',
      defaultTextareaPlaceHolder: 'Write a default option for dropdowns',
      defaultSelectValue: 'Choose an option',
      matchQuizQuestion: '',
      createItems: [
        {
          left_choice: '',
          right_choice: '',
        },
        {
          left_choice: '',
          right_choice: '',
        },
      ],
    };

    this.addMatchElement = this.addMatchElement.bind(this);
    this.deleteMatchElement = this.deleteMatchElement.bind(this);
  }

  componentWillMount() {
    const defaultText = 'Choose an option';
    if (this.props.content) {
      const newState = {
        matchQuizQuestion: this.props.content.question,
        createItems: this.props.content.pairs,
        defaultSelectValue: this.props.content.match_default,
      };

      const questionAndDefault = {
        question: this.props.content.question,
        match_default: this.props.content.match_default,
      };

      if (newState.defaultSelectValue === null) {
        newState.defaultSelectValue = defaultText;
        questionAndDefault.match_default = defaultText;
      }
      this.setState(newState);

      // Send Match Data to MainQuizGenerator
      this.props.updateParent(this.props.content.pairs, questionAndDefault, this.props.index);
    }
  }

  /* Function called everytime when user types in Quiz Title Input */
  handleQuestionInputChange(e) {
    const target = e.target;
    const value = target.value;
    this.setState({ matchQuizQuestion: value });

    const questionAndDefault = {
      question: value,
      match_default: this.state.defaultSelectValue,
    };

    // Send Match Data to MainQuizGenerator
    this.props.updateParent(this.state.createItems, questionAndDefault, this.props.index);
  }

  /* Function called everytime when user types in DEFAULT VALUE textarea */
  handleDefaultValueTextareaChange(e) {
    const target = e.target;
    const name = target.name;
    const value = target.value;

    if (name === this.state.defaultTextareaName) {
      this.setState({ defaultSelectValue: value });
    }

    const questionAndDefault = {
      question: this.state.matchQuizQuestion,
      match_default: value,
    };

    // Send Match Data to MainQuizGenerator
    this.props.updateParent(this.state.createItems, questionAndDefault, this.props.index);
  }

  /* Function called everytime when user types
  * in a LEFT or RIGHT element textarea
  */
  handleItemTextareaChange(e, index) {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    const editedItem = this.state.createItems[index];
    // Update the LEFT item with value of textarea
    if (name === this.state.leftTextareaName) {
      editedItem.left_choice = value;
    }

    // Update the RIGHT item with value of textarea
    if (name === this.state.rightTextareaName) {
      editedItem.right_choice = value;
    }
    const newCreateItemsArray = this.state.createItems;
    newCreateItemsArray[index] = editedItem;

    const questionAndDefault = {
      question: this.state.matchQuizQuestion,
      match_default: this.state.defaultSelectValue,
    };

    // Send Match Data to MainQuizGenerator
    this.props.updateParent(newCreateItemsArray, questionAndDefault, this.props.index);
    this.setState({ createItems: newCreateItemsArray });
  }

  /* Function called everytime when user clicks *Add Match Element* Button */
  addMatchElement() {
    const templateItemObj = { left_choice: '', right_choice: '' };
    const newCreateItemsArray = this.state.createItems;
    newCreateItemsArray.push(templateItemObj);
    this.setState({ createItems: newCreateItemsArray });
  }

  deleteMatchElement(index) {
    const newCreateItemsArray = this.state.createItems;
    newCreateItemsArray.splice(index, 1);
    this.setState({ createItems: newCreateItemsArray });
  }

  renderMatchItems() {
    const renderedComponents = [];
    this.state.createItems.map((obj, index) => {
      const ind = index;
      renderedComponents.push(
        <MatchQuizItem
          index={index}
          id={`create_match_item_${ind}`}
          key={`create_match_item_${ind}`}
          reviewState={this.props.reviewState}
          resultsState={this.props.resultsState}
          leftValue={obj.left_choice}
          rightValue={obj.right_choice}
          leftTextareaName={this.state.leftTextareaName}
          rightTextareaName={this.state.rightTextareaName}
          leftTextareaPlaceholder={this.state.leftTextareaPlaceholder}
          rightTextareaPlaceHolder={this.state.rightTextareaPlaceHolder}
          deleteMatchElement={deleteIndex => this.deleteMatchElement(deleteIndex)}
          onChange={(e, textareaIndex) => this.handleItemTextareaChange(e, textareaIndex)}
        />,
      );
      return ('');
    });
    return renderedComponents;
  }

  render() {
    // Testing Pupropses
    /*
    const result = {
      question: this.state.matchQuizQuestion,
      type: 'match',
      defaultValue: this.state.defaultSelectValue,
      pairs_attribute: this.state.createItems,
    };
    console.log('RENDER', result);
    */

    const createMatchQuiz = (
      <div className="matchQuizGenerator">
        <div className="createMatchQuizTitle">
          <h3>Match question</h3>
          <b>Question: </b>
          <input
            type="text"
            name="matchQuizTitle"
            className="quizTitleInput"
            value={this.state.matchQuizQuestion}
            placeholder={this.state.quizTitlePlaceHolder}
            onChange={e => this.handleQuestionInputChange(e)}
          />
        </div>
        <div className="leftColumn">
          <h3> Left Items </h3>
        </div>

        <div className="rightColumn" >
          <h3> Right Items </h3>
        </div>

        <div className="createMatchItems">
          { this.renderMatchItems() }
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
                defaultValue={this.state.defaultSelectValue}
                onChange={e => this.handleDefaultValueTextareaChange(e)}
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
  index: PropTypes.number.isRequired,
  reviewState: PropTypes.bool.isRequired,
  resultsState: PropTypes.bool.isRequired,
  updateParent: PropTypes.func.isRequired,
  content: PropTypes.shape({
    question: PropTypes.string.isRequired,
    pairs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    match_default: PropTypes.string,
  }),
};

MatchQuizGenerator.defaultProps = {
  content: null,
};
