import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';

export default function ButtonWrapper(props) {
  return (
    <div>
      <Button onClick={() => props.removeQuiz(props.index)}> Delete </Button>
    </div>
  );
}
ButtonWrapper.propTypes = {
  removeQuiz: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};
