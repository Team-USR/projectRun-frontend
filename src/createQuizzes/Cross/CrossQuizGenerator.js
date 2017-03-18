import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { Board } from './index';

export default class CrossQuizGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showBoard: false,
      boardWidth: 5,
      boardHeight: 5,
      boardValues: [{}],
      question: 'Question',
      metaAtributes: [],
      hintsAttributes: [],
    };

    this.boardWidth = 5;
    this.boardHeight = 5;

    this.renderBoard = this.renderBoard.bind(this);
  }

  handleWidthChange(e) {
    const target = e.target;
    const value = parseInt(target.value, 10);
    this.boardWidth = value;
  }

  handleHeightChange(e) {
    const target = e.target;
    const value = parseInt(target.value, 10);
    this.boardHeight = value;
  }

  handleSquareChange(e, i, j) {
    this.x = 'x';
    const event = e;
    const target = event.target;
    const value = target.value;
    if (value.length > 1) {
      event.target.value = value[1];
    }
    event.target.value = event.target.value.toUpperCase();

    // Replace the Changed Letter and Update the Board
    const newBoard = this.state.boardValues;
    let changedRow = newBoard[i].row;
    changedRow = changedRow.substr(0, j) + event.target.value + changedRow.substr(j + 1);
    newBoard[i].row = changedRow;
    this.setState({ boardValues: newBoard });

    this.props.updateParent(
      this.state.question,
      this.state.metaAtributes,
      newBoard,
      this.state.hintsAttributes,
    );
  }

  handleGenerateBoard() {
    const newBoard = this.state.boardValues;
    for (let i = 0; i < this.boardHeight; i += 1) {
      let row = '';
      if (newBoard[i] && newBoard[i].row) {
        row = newBoard[i].row.substring(0, this.boardWidth);
      } else {
        row = '*'.repeat(this.boardWidth);
      }
      newBoard[i] = { row };
    }

    this.setState({
      showBoard: true,
      boardValues: newBoard,
      boardWidth: this.boardWidth,
      boardHeight: this.boardHeight,
    });
  }

  renderBoard() {
    this.board = 'board';
    let board = (null);
    if (this.state.showBoard) {
      board = (
        <Board
          width={this.state.boardWidth}
          height={this.state.boardHeight}
          handleSquareChange={(e, i, j) => this.handleSquareChange(e, i, j)}
        />);
    }

    return board;
  }

  render() {
    return (
      <div className="crossQuizGenerator">
        <div className="createCrossQuizTitle">
          <h3>Cross question</h3>

          <h5>Board Size: </h5>
          <form>
            <label htmlFor="boardWidth">Width</label>
            <input
              id="boardWidth"
              type="number"
              onChange={e => this.handleWidthChange(e)}
              defaultValue={this.state.boardWidth}
            />
            <label htmlFor="boardHeight">Height</label>
            <input
              id="boardHeight"
              type="number"
              onChange={e => this.handleHeightChange(e)}
              defaultValue={this.state.boardHeight}
            />
            <Button onClick={() => this.handleGenerateBoard()}>Generate</Button>
          </form>

          { this.renderBoard() }
        </div>
      </div>
    );
  }
}

CrossQuizGenerator.propTypes = {
  updateParent: PropTypes.func.isRequired,
};
