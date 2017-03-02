import React, { PropTypes } from 'react';

export default function AlternateSolution(props) {
  return (
    <div className="AlternateSolutionWrapper">
      {props.index + 1}
      <input
        value={props.value}
        onChange={e => props.handleInputChange(e, props.index)}
      />
      <button onClick={() => props.removeSolution(props.index)}>
        Remove Solution
      </button>
    </div>
  );
}

AlternateSolution.propTypes = {
  value: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  removeSolution: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};
