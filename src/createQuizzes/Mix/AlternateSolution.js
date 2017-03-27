import React, { PropTypes } from 'react';
import { Button, Col } from 'react-bootstrap';

export default function AlternateSolution(props) {
  return (
    <div className="AlternateSolutionWrapper">
      <Col md={12} className="alternate_container">
        <Col md={2}>
          <h5 className="alternate_heading">{props.index + 1}.</h5>
        </Col>
        <Col md={9}>
          <input
            className="form-control"
            value={props.value}
            onChange={e => props.handleInputChange(e, props.index)}
          />
        </Col>
        <Col md={1}>
          <Button onClick={() => props.removeSolution(props.index)}>
            Remove
          </Button>
        </Col>
      </Col>
    </div>
  );
}

AlternateSolution.propTypes = {
  value: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  removeSolution: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};
