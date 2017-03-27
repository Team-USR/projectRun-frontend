import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';

export default function ButtonWrapper(props) {
  return (
    <div className="delete_button">
      <Button
        className="red_button"
        onClick={() => props.removeQuiz(props.index)}
      >
        Delete this question
      </Button>
    </div>
  );
}
ButtonWrapper.propTypes = {
  removeQuiz: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};
