import React, { Component } from 'react';
import { Question, Choice } from './index';
import '../../style/MultipleChoice.css';

class QuestionWrapper extends Component {
  constructor() {
    super();
    this.state = { results: [] }
  }
  onChildChanged(newState, index) {
  const newArray = this.state.results.slice();
  newArray[index] = newState;
  this.setState({ results: newArray })
  this.props.callbackParent(newArray, index);
  }
  renderChoices(index, choice) {
  return (
    <Choice
      value={index} choiceText={choice}
      initialChecked={this.state.checked}
      callbackParent={(newState) => { this.onChildChanged(newState, index) }}
    />
    );
  }
  render() {
  const { objectQuestion, id } = this.props;
  return (
    <div className="questionWrapper">
      <div className="questionPanel">
        <Question question={objectQuestion.question} id={id} />
      </div>
      <div className="choicePanel">
        <form>
          {objectQuestion.choice.map((choice, index) => this.renderChoices(index, choice))}
        </form>
        </div>
    </div>
  );
}
}

export { QuestionWrapper };
