import React, { PropTypes } from 'react';


export default function Answer(props) {
  const { correctAnswer, feedback } = props;
  return (
    <h4>Answer: {correctAnswer}</h4>
  );
}

Answer.propTypes = {
  correctAnswer: PropTypes.string.isRequired,
  feedback: PropTypes.string.isRequired,
};
