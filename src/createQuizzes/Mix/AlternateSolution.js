import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';

export default function AlternateSolution(props) {
  return (
    <div className="AlternateSolutionWrapper">
      {props.index + 1}
      <input
        className="form_alternate_input"
        value={props.value}
        onChange={e => props.handleInputChange(e, props.index)}
      />
      <Button onClick={() => props.removeSolution(props.index)}>
        Remove
      </Button>
    </div>
  );
}

AlternateSolution.propTypes = {
  value: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  removeSolution: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};
