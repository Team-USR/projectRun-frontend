import React, { Component, PropTypes } from 'react';
import { Square } from './index';

export default class Board extends Component {
  renderSquare(i) {
    this.i = i;
    return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }
  renderSq(i, j) {
    return (
      <Square
        value={this.props.squares[i][j].value}
        squareType={this.props.squares[i][j].type}
        onClick={() => this.props.onClick()}
      />
    );
  }
  render() {
    return (
      <div className="crossBoardWrapper">
        <table>
          <tbody>
            <tr>
              {this.renderSq(0, 0)}
              {this.renderSq(0, 1)}
              {this.renderSq(0, 2)}
              {this.renderSq(0, 3)}
            </tr>
            <tr>
              {this.renderSq(1, 0)}
              {this.renderSq(1, 1)}
              {this.renderSq(1, 2)}
              {this.renderSq(1, 3)}
            </tr>
            <tr>
              {this.renderSq(2, 0)}
              {this.renderSq(2, 1)}
              {this.renderSq(2, 2)}
              {this.renderSq(2, 3)}
            </tr>
            <tr>
              {this.renderSq(3, 0)}
              {this.renderSq(3, 1)}
              {this.renderSq(3, 2)}
              {this.renderSq(3, 3)}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

Board.propTypes = {
  squares: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClick: PropTypes.func.isRequired,
};
