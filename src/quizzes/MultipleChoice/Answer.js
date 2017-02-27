import React from 'react';


function Answer() {
  const { correctAnswer } = this.props;
  return (
    <h4>Answer: {correctAnswer}</h4>
  );
}
export default Answer;
