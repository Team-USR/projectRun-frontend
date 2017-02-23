import React, { Component, PropTypes } from 'react';


class Answer extends Component {

  render() {
    const { correctAnswer, feedback } = this.props;
    return (
      <h4>Answer: {correctAnswer}</h4>
    );
  }
}
Answer.propTypes = {
  correctAnswer: PropTypes.string.isRequired,
  feedback: PropTypes.string.isRequired,
};
export default Answer ;
