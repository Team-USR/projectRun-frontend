import React, { PropTypes } from 'react';

export default function Square(props) {
  let hintNo = '';
  if (props.hintNumber !== 0) {
    hintNo = props.hintNumber;
  }
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
      <td className="squareContent">
        <div className="hintNumber">
          { hintNo }
        </div>
        <div>
          <b>{ props.value }</b>
        </div>
      </td>);
  }

  if (props.squareType === 'black') {
    square = (<td className="blackSquare" />);
  }

  return square;
}

Square.propTypes = {
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
