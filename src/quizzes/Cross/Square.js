import React, { PropTypes } from 'react';

export default function Square(props) {
  let square = (<td />);

  if (props.squareType === 'clickable') {
    square = (
      <td>
        <button className="square" onClick={() => props.onClick()}>
          {props.value}
        </button>
      </td>
    );
  }

  if (props.squareType === 'static') {
    square = (
      <td className="square">
        {props.value}
      </td>);
  }

  if (props.squareType === 'black') {
    square = (<td className="blackSquare" />);
  }

  return square;
}

Square.propTypes = {
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
