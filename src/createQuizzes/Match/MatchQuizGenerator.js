import React, { Component, PropTypes } from 'react';
import { Button, Col } from 'react-bootstrap';
import { MatchQuizItem } from './index';

export default class MatchQuizGenerator extends Component {

  /**
  * This is the Main Constructor for MatchQuizGenerator Class
  * @param {Object} props object of properties
  */
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

  /**
  * This function is called before 'render()'
  * It checks if the component receives the content prop
  * in order to display the stored data of Match available for editing
  * It also updetes its parent calling the function 'updateParent()'
  */
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

  /**
  * Function called everytime when user types in Quiz Title Input
  * It stores the value of the input
  * @param {Event} e The event triggerd when the Question Inputs is changed
  */
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

  /**
  * Function called everytime when user types in DEFAULT VALUE textarea
  * It stores the value of the text area
  * @param {Event} e The event triggerd on key press
  */
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

  /**
  * Function called everytime when user types
  * in a LEFT or RIGHT element textarea
  * It stores the value of the text area in state
  * @param {Event, Integer} e, index The event triggerd on key press and index
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

  /**
  * Function called everytime when user clicks *Add Match Element* Button
  * It displays a new match item a the bottom of the list
  */
  addMatchElement() {
    const templateItemObj = { left_choice: '', right_choice: '' };
    const newCreateItemsArray = this.state.createItems;
    newCreateItemsArray.push(templateItemObj);

    const questionAndDefault = {
      question: this.state.matchQuizQuestion,
      match_default: this.state.defaultSelectValue,
    };
    this.props.updateParent(newCreateItemsArray, questionAndDefault, this.props.index);
    this.setState({ createItems: newCreateItemsArray });
  }

  /**
  * Function called everytime when user clicks *Delete Match Element* Button
  * It erases the item from the list and updates the state
  * @param {Integer} index The index of item to be deleted.
  */
  deleteMatchElement(index) {
    const newCreateItemsArray = this.state.createItems;
    newCreateItemsArray.splice(index, 1);

    const questionAndDefault = {
      question: this.state.matchQuizQuestion,
      match_default: this.state.defaultSelectValue,
    };
    this.props.updateParent(newCreateItemsArray, questionAndDefault, this.props.index);
    this.setState({ createItems: newCreateItemsArray });
  }


  /**
  * Function used for displaying a Match - Left Right pair of items
  * It contains the main Item Component wich takes
  * the content and functions as properties
  * @return {Object} renderedComponents  The MatchQuizItem Component
  */
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

  /**
  * This is the main render function which is in charge of displaying
  * the Match Quiz GEnerator Component. It calls the renderMatchItems()
  * function to render the each pair of elements as a row item
  * @return {Object} createMatchQuiz  The Match Quiz Generator Component
  */
  render() {
    const createMatchQuiz = (
      <div className="matchQuizGenerator">
        <div className="createMatchQuizTitle">
          <h3 className="question_title">Match question</h3>
        </div>
        <Col md={12} className="matchQuestionWrapper">
          <Col md={2}>
            <div>
              <h4>Question: </h4>
            </div>
          </Col>
          <Col md={10}>
            <input
              type="text"
              name="matchQuizTitle"
              className="quizTitleInput form-control"
              value={this.state.matchQuizQuestion}
              placeholder={this.state.quizTitlePlaceHolder}
              onChange={e => this.handleQuestionInputChange(e)}
            />
          </Col>
        </Col>

        <Col md={12}>
          <Col md={6} sm={6} xs={6}>
            <h3> Left Items </h3>
          </Col>
          <Col md={6} sm={6} xs={6}>
            <h3> Right Items </h3>
          </Col>
        </Col>

        <div className="createMatchItems">
          { this.renderMatchItems() }
        </div>

        <Col md={12} className="quizItem" id="deafultValue" key="defaultValue">
          <Col md={1} />
          <Col md={5} className="addMoreItemsBtn">
            <Button className="" onClick={this.addMatchElement}> Add Match Element</Button>
          </Col>

          <Col md={5}>
            <div className="defaultOption">
              <textarea
                disabled={this.props.reviewState}
                name={this.state.defaultTextareaName}
                className="itemTexarea rightTextarea form-control"
                placeholder={this.state.defaultTextareaPlaceHolder}
                defaultValue={this.state.defaultSelectValue}
                onChange={e => this.handleDefaultValueTextareaChange(e)}
              />
            </div>
            <Col md={1} />
          </Col>
        </Col>

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
