import React, { Component, PropTypes } from 'react';

export default class Square extends Component {

  render() {
    const square = (
      <td>
        <input
          className="crossSquareInput"
          type="text"
          onChange={e => this.props.handleSquareChange(e)}
        />
      </td>
    );
    return square;
  }
}

Square.propTypes = {
  handleSquareChange: PropTypes.func.isRequired,
};
