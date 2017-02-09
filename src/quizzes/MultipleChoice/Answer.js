import React, { Component } from 'react';


class Answer extends Component {

isCorrect(myAnswer, correctAnswer) {
if (myAnswer === correctAnswer) {
  return 'CORRECT';
} return 'WRONG';
}
render() {
  const { myAnswer, correctAnswer, feedback } = this.props;
  return (
    <h4>{this.isCorrect(myAnswer, correctAnswer)},  Feedback: {feedback}</h4>
  );
}
}

export { Answer } ;
