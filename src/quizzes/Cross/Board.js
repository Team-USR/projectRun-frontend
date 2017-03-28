import React, { Component, PropTypes } from 'react';
import { Square } from './index';

/**
 * Class that renders the entire Board for Viewer and Reviwer
 * @param {Object} props
 * @return {Object} square
 * @type {Object}
 */
export default class Board extends Component {

  /**
  * Function that is in charge of rendering a Square component
  * @param {Integer, Integer} i, j  coordinates
  * @return {Object} Square component
  */
  renderSquare(i, j) {
    let board = this.props.content;

    if (this.props.sessionAnswers && this.props.sessionAnswers.rows) {
      board = this.props.sessionAnswers.rows;
    }

    let squareValue = '';
    let sqType = 'black';

    if (board[i][j] && board[i][j] === '*') {
      sqType = 'black';
    } else if (board[i][j] && board[i][j] !== '*') {
      if (this.props.inReview) {
        squareValue = board[i][j].toUpperCase();
        if (board[i][j] === '_') {
          squareValue = '';
        }
        sqType = 'static';
      } else if (board[i][j] === '_') {
        squareValue = '';
        sqType = 'editable';
      } else {
        squareValue = board[i][j].toUpperCase();
        sqType = 'editable';
      }
    }

    return (
      <Square
        squareType={sqType}
        value={squareValue}
        hintNumber={this.props.hintsNumbers[i][j]}
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
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  inReview: PropTypes.bool.isRequired,
  sessionAnswers: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.string),
  }),
  content: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleSquareChange: PropTypes.func,
  hintsNumbers: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
};

Board.defaultProps = {
  handleSquareChange: null,
  sessionAnswers: {
    rows: null,
  },
};
