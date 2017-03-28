import React, { Component, PropTypes } from 'react';

/**
 * Class that renders a Square of the Board for Generator and Editor
 * It receives its Event Handler from props and renders an input
 * @param {Object} props
 * @return {Object} square
 * @type {Object}
 */
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
