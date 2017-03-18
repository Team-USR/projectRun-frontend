import React, { Component, PropTypes } from 'react';
import { Square } from './index';

export default class Board extends Component {

  renderSquare(i, j) {
    return (
      <Square
        value={'X'}
        handleSquareChange={e => this.props.handleSquareChange(e, i, j)}
        key={`square${i}${j}`}
      />
    );
  }

  renderRow(i) {
    const row = [];
    for (let j = 0; j < this.props.width; j += 1) {
      const sq = this.renderSquare(i, j);
      row.push(sq);
    }
    return row;
  }

  renderBoard() {
    // const width = this.props.width;
    const height = this.props.height;
    const board = [];

    for (let i = 0; i < height; i += 1) {
      const row = this.renderRow(i);
      board.push(row);
    }

    return (
      <div>
        <table className="crossBoardWrapper">
          <tbody>
            {
              board.map((array, index) => {
                const ind = index;
                const row = (
                  <tr
                    key={`row${ind}`}
                  >{ array }</tr>
                );
                return row;
              })
            }
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    this.i = 'i';
    return (
      <div>
        Board
        { this.renderBoard() }
      </div>
    );
  }
}

Board.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  handleSquareChange: PropTypes.func.isRequired,
};
