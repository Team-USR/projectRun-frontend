import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { ChoiceInput } from './index';

let displayIndex = 0;
export default class MultipleChoiceQuizGenerator extends Component {
  constructor() {
    super();
    this.state = { answerNoState: 0,
      answers_choices: [],
      answers_attributes: [],
      question: '' };
    this.addAnswers = this.addAnswers.bind(this);
    this.setQuestion = this.setQuestion.bind(this);
  }
  componentWillMount() {
    if (this.props.content) {
      this.initializeAnswers(this.props.content);
      this.setState({ question: this.props.content.question });
    }
  }
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
  onChildChangedText(index, answer, isCorrect) {
    const newAnswer = { answer, is_correct: isCorrect };
    const newArray = this.state.answers_choices;
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
  setQuestion(event) {
    this.setState({ question: event.target.value });
    this.props.updateParent(this.state.answers_attributes,
       event.target.value,
       this.props.index);
  }
  addAnswers() {
    const choicesTemp = this.state.answers_choices;
    choicesTemp.push(0);
    this.setState({ answers_choices: choicesTemp });
  }
  initializeAnswers(content) {
    const choicesTemp = this.state.answers_choices;
    content.answers.map(() => choicesTemp.push(0));
    this.setState({ answers_choices: choicesTemp });
  }
  renderAnswers(index, answersToComplete) {
    // console.log("multiple",answersToComplete);
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
        <h4>Multiple choice question</h4>
        <div className="">
          <label htmlFor="textInput">
            Question
            <input
              id="textInput" type="text" onChange={this.setQuestion} defaultValue={questionText}
            />
          </label>
          <Button onClick={this.addAnswers}>Add more answers</Button>
          <form>
            {this.state.answers_choices.map((element, index) =>
            this.renderAnswers(index, answersToComplete))}
          </form>
        </div>
      </div>
    );
  }
  }
MultipleChoiceQuizGenerator.propTypes = {
  handleInput: PropTypes.func.isRequired,
  updateParent: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  content: PropTypes.shape({
    question: PropTypes.string,
    answers: PropTypes.arrayOf(PropTypes.shape({})),
  }),
};
MultipleChoiceQuizGenerator.defaultProps = {
  content: {},
};
