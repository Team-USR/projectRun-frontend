import React, { PropTypes } from 'react';

/**
 * Function that renders a Square of the Board for Viewer and Reviwer
 * It receives its type from props and renders an input,
*  black, or static square for the Board
 * @param {Object} props
 * @return {Object} square
 * @type {Object}
 */
export default function Square(props) {
  let hintNo = '';
  if (props.hintNumber !== 0) {
    hintNo = props.hintNumber;
  }
  let square = (<td />);

  if (props.squareType === 'editable') {
    square = (
      <td className="squareContent">
        <div className="hintNumber">
          { hintNo }
        </div>
        <input
          className="crossSquareInput"
          type="text"
          defaultValue={props.value}
          onChange={e => props.handleSquareChange(e)}
        />
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
