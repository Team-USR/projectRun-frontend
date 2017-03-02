import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { ChoiceInput } from './index';
import '../../style/MultipleChoice.css';

let displayIndex = 0;
export default class MultipleChoiceQuizGenerator extends Component {
  constructor() {
    super();
    this.state = { answerNoState: 0, answers_choices: [], answers_attributes: [], question: '' };
    this.addAnswers = this.addAnswers.bind(this);
    this.setQuestion = this.setQuestion.bind(this);
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
    this.props.updateParent(filteredArray, this.state.question);
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
    this.props.updateParent(filteredArray, this.state.question);
  }
  setQuestion(event) {
    this.setState({ question: event.target.value });
    this.props.updateParent(this.state.answers_attributes, event.target.value);
  }
  addAnswers() {
    const choicesTemp = this.state.answers_choices;
    choicesTemp.push(0);
    this.setState({ answers_choices: choicesTemp });
  }
  renderAnswers(index, content) {
    if (this.state.answers_choices[index] === null) {
      displayIndex -= 1;
    }
    if (this.state.answers_choices[index] !== '') {
      displayIndex += 1;
      return (
        <ChoiceInput
          ind={index}
          displayedIndex={displayIndex}
          key={index}
          onChange={this.props.handleInput(this.state.answers_choices)}
          value={content}
          callbackParent={indexs => this.onChildChanged(indexs)}
          callbackParentInput={(indexs, choice, answer) =>
             this.onChildChangedText(indexs, choice, answer)}
        />
      );
    }
    return ('');
  }
  render() {
    displayIndex = 0;
    return (
      <div className="questionBlock">
        <h3>Multiple choice question</h3>
        <div className="">
          <label htmlFor="textInput">
            Question
            <input id="textInput" type="text" onChange={this.setQuestion} />
          </label>
          <Button onClick={this.addAnswers}>Add more answers</Button>
          <form>
            {this.state.answers_choices.map((element, index) =>
            this.renderAnswers(index, this.props.content))}
          </form>
        </div>
      </div>
    );
  }
  }
MultipleChoiceQuizGenerator.propTypes = {
  handleInput: PropTypes.func.isRequired,
  updateParent: PropTypes.func.isRequired,
  content: PropTypes.arrayOf(String),
};
MultipleChoiceQuizGenerator.defaultProps = {
  content: [],
};
