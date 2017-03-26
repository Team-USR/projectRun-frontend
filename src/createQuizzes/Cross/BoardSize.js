import React, { PropTypes } from 'react';
import { Col } from 'react-bootstrap';

export default function BoardSize(props) {
  let size = props.size;
  if (isNaN(size)) {
    size = 0;
  }

  return (
    <div>
      <Col md={4}>
        <label htmlFor={props.id}>
          { props.labelValue }
        </label>
      </Col>
      <Col md={8}>
        <input
          className="form-control"
          id={props.id}
          type="number"
          onChange={e => props.handleSizeChange(e)}
          value={size}
        />
      </Col>
    </div>
  );
}

BoardSize.propTypes = {
  id: PropTypes.string.isRequired,
  labelValue: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  handleSizeChange: PropTypes.func.isRequired,
};