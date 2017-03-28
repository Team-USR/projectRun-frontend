import React, { Component, PropTypes } from 'react';
import { Button, Col } from 'react-bootstrap';
import { ChoiceInput } from './index';

let displayIndex = 0;
/*
 Single Choice question generator component
*/
export default class SingleChoiceQuizGenerator extends Component {
  constructor() {
    super();
    this.state = { answerNoState: 0, answers_choices: [], answers_attributes: [], question: '', selected: -1 };
    this.addAnswers = this.addAnswers.bind(this);
    this.setQuestion = this.setQuestion.bind(this);
  }
  /*
    When first mounted checks if there is any content that has to be displayed( in the case the
  component is mounted from the editor page and has to populate the field with data)
  */
  componentWillMount() {
    if (this.props.content) {
      this.initializeAnswers(this.props.content);
      this.setState({ question: this.props.content.question });
    }
  }
  /*
  When child components are changing this method updates the parent and works
  towards the collecting of the final object that needs to be sent to the backend
  @param indexs {Number} [Index of the choice that has changed]
  */
  onChildChanged(indexs) {
    const newArray = this.state.answers_choices;
    newArray[indexs] = '';
    const filteredArray = newArray.filter((element) => {
      if (element !== '') {
        return element;
      }
      return false;
    },
  );
    this.setState({ answers_choices: newArray, answers_attributes: filteredArray });
    this.props.updateParent(filteredArray,
       this.state.question,
       this.props.index);
  }
  /*
    Updates the parent component when the text inputed in the answer fields is changed in
    any of the answer fields created by the user.
    @param index {Number}
    @param answer {Object}
    @param isCorrect {Boolean}
  */
  onChildChangedText(index, answer, isCorrect) {
    const newAnswer = { answer, is_correct: isCorrect };
    const newArray = this.state.answers_choices;
    if (isCorrect === true) {
      this.setState({ selected: index });
      newArray.map((item) => {
        if (item.is_correct !== null && item.is_correct !== undefined) {
          item.is_correct = false;
        }
        return 0;
      });
    }
    newArray[index] = newAnswer;
    const filteredArray = newArray.filter((element) => {
      if (element !== '') {
        return element;
      }
      return false;
    },
  );
    this.setState({ answers_choices: newArray, answers_attributes: filteredArray });
    this.props.updateParent(filteredArray,
      this.state.question,
      this.props.index);
  }
  /*
  Sets the question state and updates the parent component providing the question and completing
  the final object that needs to be send to the backend.
  @param event
  */
  setQuestion(event) {
    this.setState({ question: event.target.value });
    this.props.updateParent(this.state.answers_attributes,
       event.target.value,
       this.props.index);
  }
  /*
    Adds more answer fields on the screen
  */
  addAnswers() {
    const choicesTemp = this.state.answers_choices;
    choicesTemp.push(0);
    this.setState({ answers_choices: choicesTemp });
  }
  /*
  Initialize the array of answers so the renderer knows
  how many answer field has to be rendered in the case
  the component is mounted when coming from the editor.
  @param content {Object}
  */
  initializeAnswers(content) {
    const choicesTemp = this.state.answers_choices;
    content.answers.map(() => choicesTemp.push(0));
    this.setState({ answers_choices: choicesTemp });
  }
  /*
  Rendering answers on the screen
  @param index {Number} [index of the answer]
  @param answersToComplete {array} [array of answers that might be completed
  in the case that the parent is the editor]
  */
  renderAnswers(index, answersToComplete) {
    if (this.state.answers_choices[index] === null) {
      displayIndex -= 1;
    }
    let sendCompletedAnswer;
    if (answersToComplete !== undefined) {
      sendCompletedAnswer = answersToComplete[index];
    }
    if (this.state.answers_choices[index] !== '') {
      displayIndex += 1;
      return (
        <ChoiceInput
          ind={index}
          displayedIndex={displayIndex}
          key={index}
          selected={this.state.selected}
          onChange={this.props.handleInput(this.state.answers_choices)}
          answersToComplete={sendCompletedAnswer}
          callbackParent={indexs => this.onChildChanged(indexs)}
          callbackParentInput={(indexs, choice, answer) =>
             this.onChildChangedText(indexs, choice, answer)}
        />
      );
    }
    return ('');
  }
  /*
  Main render function
  */
  render() {
    let questionText;
    let answersToComplete;
    if (this.props.content) {
      questionText = this.props.content.question;
      answersToComplete = this.props.content.answers;
    } else questionText = '';

    displayIndex = 0;
    return (
      <div className="questionBlock">
        <h3 className="question_title">Single choice question</h3>
        <div className="">
          <Col md={12} >
            <Col md={3} className="questionInput">
              <h4 style={{ marginBottom: 5 }}>
            Question:
            </h4>
            </Col>
            <Col md={6}>
              <input
                placeholder="ex: What is your favourite colour?"
                className="form-control"
                id="textInput" type="text" onChange={this.setQuestion} defaultValue={questionText}
              />
            </Col>
            <Col md={3}>
              <Button onClick={this.addAnswers}>Add more answers</Button>
            </Col>
          </Col>
          <form style={{ paddingTop: 60 }}>
            {this.state.answers_choices.map((element, index) =>
            this.renderAnswers(index, answersToComplete))}
          </form>
        </div>
      </div>
    );
  }
  }
SingleChoiceQuizGenerator.propTypes = {
  handleInput: PropTypes.func.isRequired,
  updateParent: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  content: PropTypes.shape({
    question: PropTypes.string,
    answers: PropTypes.arrayOf(PropTypes.shape({})),
  }),
};
SingleChoiceQuizGenerator.defaultProps = {
  content: {},
};
