import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { TextInput, ChoiceInput } from './index';

export default class MultipleChoiceQuizGenerator extends Component {
  constructor() {
    super();
    this.state = { answerNoState: 0, choices: [] };
    this.addAnswers = this.addAnswers.bind(this);
  }
  onChildChanged(indexs) {
    const newArray = this.state.choices;
    newArray[indexs] = '';
    this.setState({ choices: newArray });
  }
  onChildChangedText(index, choice, answer) {
    const newAnswer = { choice, answer };
    const newArray = this.state.choices;
    newArray[index] = newAnswer;
    this.setState({ choices: newArray });
  }
  addAnswers() {
    const choicesTemp = this.state.choices;
    choicesTemp.push(this.state.choices.length);
    this.setState({ choices: choicesTemp });
  }
  renderAnswers(index, content) {
    if (this.state.choices[index]) {
      return (
        <ChoiceInput
          ind={index}
          key={index}
          onChange={this.props.handleInput(this.state.choices)}
          value={content}
          callbackParent={indexs => this.onChildChanged(indexs)}
          callbackParentInput={(choice, answer) => this.onChildChangedText(index, choice, answer)}
        />
      );
    }
    return ('');
  }
  render() {
    return (
      <div className="questionBlock">
        <h3>Multiple choice question</h3>
        <div className="">
          <TextInput text="Question: " />
          <Button onClick={this.addAnswers}>Add more answers</Button>
          <form>
            {this.state.choices.map((element, index) =>
            this.renderAnswers(index, this.props.content))}
          </form>
        </div>
      </div>
    );
  }
  }
MultipleChoiceQuizGenerator.propTypes = {
  handleInput: PropTypes.func.isRequired,
  content: PropTypes.arrayOf(String),
};
MultipleChoiceQuizGenerator.defaultProps = {
  content: [],
};
