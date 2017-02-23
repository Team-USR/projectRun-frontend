import React, { Component, PropTypes } from 'react';


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
  myAnswer: PropTypes.string.isRequired,
  correctAnswer: PropTypes.string.isRequired,
  feedback: PropTypes.string.isRequired,
};
export default Answer ;
