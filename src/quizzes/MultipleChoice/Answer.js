import React, { Component } from 'react';


class Answer extends Component {

  isCorrect(myAnswer, correctAnswer) {
    if (this.myAnswer === correctAnswer) {
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
Answer.propTypes = {
  myAnswer: React.PropTypes.string.isRequired,
  correctAnswer: React.PropTypes.string.isRequired,
  feedback: React.PropTypes.string.isRequired,
};
export default Answer ;
