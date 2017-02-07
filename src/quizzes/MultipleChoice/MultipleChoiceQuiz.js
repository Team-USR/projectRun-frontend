import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { QuestionWrapper } from './index';
import '../../style/MultipleChoice.css';

class MultipleChoiceQuiz extends Component {
  constructor() {
    super();
    //Test input state
    this.state = { quizObject: [
        { question: 'First question?', choice: ['choice', 'choice2', 'choice3', 'choice', 'choice2', 'choice3'] },
        { question: 'First question?', choice: ['choice', 'choice2', 'choice3'] },
        { question: 'First question?', choice: ['choice', 'choice2', 'choice3'] },
        { question: 'Second question?', choice: ['choice', 'choice2', 'choice3'] },
        { question: 'Third question?', choice: ['yaysdyasdyaasd', 'ahsdhjabsd', 'sdnbaksd'] }
      ],
       answers: [] }
}

onChildChanged(newState, index) {
  const newArray = this.state.answers.slice();
  newArray[index] = newState;
  this.setState({ answers: newArray })
}

renderQuestions(objectQuestion, id) {
  return (
    <QuestionWrapper
     objectQuestion={objectQuestion}
     id={id}
     callbackParent={(newState) => this.onChildChanged(newState, id)}
    />
  );
}
  render() {
    return (
      <div className="questionsBlock">
      {this.state.quizObject.map((objectQuestion, id) => this.renderQuestions(objectQuestion, id))}
          <div className="submitPanel">
            <Button className="submitButton">SUBMIT</Button>
          </div>
      </div>
    );
  }
}

export { MultipleChoiceQuiz };
