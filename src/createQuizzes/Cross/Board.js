import React, { Component, PropTypes } from 'react';
import { Square } from './index';

export default class Board extends Component {

  renderSquare(i, j) {
    const board = this.props.content;
    let squareValue = '';
    if (board[i].row[j] && board[i].row[j] !== '*') {
      squareValue = board[i].row[j];
    }
    return (
      <Square
        value={squareValue}
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
        <table className="crossBoardTable">
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
    return (
      <div className="crossBoardWrapper">
        { this.renderBoard() }
      </div>
    );
  }
}

Board.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  content: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handleSquareChange: PropTypes.func.isRequired,
};
