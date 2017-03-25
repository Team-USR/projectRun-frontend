import React, { PropTypes } from 'react';

export default function BoardSize(props) {
  // console.log(props.size);
  return (
    <div>
      <label htmlFor={props.id}>
        { props.labelValue }
      </label>
      <input
        id={props.id}
        type="number"
        onChange={e => props.handleSizeChange(e)}
        value={props.size}
      />
    </div>
  );
}

BoardSize.propTypes = {
  id: PropTypes.string.isRequired,
  labelValue: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  handleSizeChange: PropTypes.func.isRequired,
};
