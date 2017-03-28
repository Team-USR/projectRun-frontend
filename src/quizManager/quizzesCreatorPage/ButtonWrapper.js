import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';

/*
  Component that contains a delete button
*/
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
