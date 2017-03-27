import React, { Component, PropTypes } from 'react';

export default class Square extends Component {

  render() {
    const square = (
      <td>
        <input
          className="crossSquareInput"
          type="text"
          value={this.props.value}
          onChange={e => this.props.handleSquareChange(e)}
        />
      </td>
    );
    return square;
  }
}

Square.propTypes = {
  value: PropTypes.string.isRequired,
  handleSquareChange: PropTypes.func.isRequired,
};
