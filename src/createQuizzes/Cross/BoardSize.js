import React, { PropTypes } from 'react';
import { Col } from 'react-bootstrap';

/**
 * Class that renders a component for Width and Height of the Board
 * It takes the value from its props and
 * contains a label and an input
 * @param {Object} props
 * @type {Object}
 */
export default function BoardSize(props) {
  let size = props.size;
  if (isNaN(size)) {
    size = 0;
  }

  return (
    <Col md={12} className={props.styleClass}>
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
    </Col>
  );
}

BoardSize.propTypes = {
  id: PropTypes.string.isRequired,
  labelValue: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  handleSizeChange: PropTypes.func.isRequired,
  styleClass: PropTypes.string,
};

BoardSize.defaultProps = {
  styleClass: '',
};
