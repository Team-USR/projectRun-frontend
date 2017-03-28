import React, { Component, PropTypes } from 'react';
import { Square } from './index';

export default class Board extends Component {

  /**
  * Function that is in charge of rendering a Square component
  * @param {Integer, Integer} i, j  coordinates
  * @return {Object} Square component
  */
  renderSquare(i, j) {
    const board = this.props.content;
    let squareValue = '';
    if (board[i] && board[i].row[j] && board[i].row[j] !== '*') {
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

  /**
  * Function that is in charge of rendering a collection of
  * Squares in a Row
  * @param {Integer} i  row index
  * @return {Array} row  The Squares
  */
  renderRow(i) {
    const row = [];
    for (let j = 0; j < this.props.width; j += 1) {
      const sq = this.renderSquare(i, j);
      row.push(sq);
    }
    return row;
  }

  /**
  * Function that is in charge of rendering the intire Board
  * A matrix of Squares organised in a table
  * @return {Object} table  The Board Component
  */
  renderBoard() {
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

  /**
  * Function that is in charge of rendering the intire Board
  * calling the function 'renderBoard()'
  * @return {Object} The Board Wrapper
  */
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
