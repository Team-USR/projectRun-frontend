import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';

export default function QuizManager(props) {
  return (
    <div className="groupQuizzesWrapper">
      <span><b> {props.value} </b></span>
      <Button onClick={() => props.removeQuiz(props.quizId)}>
      X </Button>
    </div>
  );
}

QuizManager.propTypes = {
  value: PropTypes.string.isRequired,
  removeQuiz: PropTypes.func.isRequired,
  quizId: PropTypes.number.isRequired,
};
