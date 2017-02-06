import React, { Component } from 'react';
import { Question, Choice } from './index';
import '../../style/MultipleChoice.css';

class QuestionWrapper extends Component {
  constructor() {
    super();
    this.state = { checked: false }
    const answers = [];
  }

onChildChanged(newState) {
      this.setState({ checked: newState });
}
render() {
  return (
    <div className="questionWrapper">
      <div className="questionPanel">
        <Question question="What's up?" index="1" />
      </div>
      <div className="choicePanel">
        <form>
            <Choice value="1" choiceText=" Answer 1" initialChecked={this.state.checked} callbackParent={(newState) => this.onChildChanged(newState)} />
            <Choice value="2" choiceText=" Answer 2" />
            <Choice value="3" choiceText=" Answer 3" />
            <Choice value="4" choiceText=" Answer 4" />
        </form>
      </div>
    </div>

  );
}
}

export { QuestionWrapper };
