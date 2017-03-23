import React, { Component, PropTypes } from 'react';
import { Square } from './index';

export default class Board extends Component {
  // renderSquare2(i) {
  //   this.i = i;
  //   return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  // }
  // renderSq(i, j) {
  //   return (
  //     <Square
  //       value={this.props.squares[i][j].value}
  //       squareType={this.props.squares[i][j].type}
  //       onClick={() => this.props.onClick()}
  //     />
  //   );
  // }

  renderSquare(i, j) {
    // console.log(this.props.content);
    const board = this.props.content;
    let squareValue = '';
    let sqType = 'black';
    if (board[i][j] && board[i][j] !== '*') {
      squareValue = board[i][j].toUpperCase();
      sqType = 'static';
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

  renderRow(i) {
    const row = [];
    for (let j = 0; j < this.props.width; j += 1) {
      const sq = this.renderSquare(i, j);
      row.push(sq);
    }
    return row;
  }

  renderBoard() {
    // console.log(this.props.height);
    const height = this.props.height;
    const board = [];

    for (let i = 0; i < height; i += 1) {
      const row = this.renderRow(i);
      board.push(row);
    }

    // console.log(board);
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
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  content: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleSquareChange: PropTypes.func,
};

Board.defaultProps = {
  handleSquareChange: null,
};
