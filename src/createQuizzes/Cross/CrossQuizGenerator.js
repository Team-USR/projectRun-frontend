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
      crossQuizQuestion: 'Question',
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

  /* Function called everytime when user types in Quiz Title Input */
  handleQuestionInputChange(e) {
    const target = e.target;
    const value = target.value;
    this.setState({ crossQuizQuestion: value });

    const questionTitle = value;
    const metaAtributes = { width: this.state.boardWidth, height: this.state.boardHeight };
    const rowsAttributes = this.state.boardValues;
    const hintsAttributes = this.state.hintsAttributes;

    // Send Match Data to MainQuizGenerator
    this.props.updateParent(questionTitle, metaAtributes, rowsAttributes, hintsAttributes);
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

    const questionTitle = this.state.crossQuizQuestion;
    const metaAtributes = { width: this.state.boardWidth, height: this.state.boardHeight };
    const rowsAttributes = newBoard;
    const hintsAttributes = this.state.hintsAttributes;

    // Send Match Data to MainQuizGenerator
    this.props.updateParent(questionTitle, metaAtributes, rowsAttributes, hintsAttributes);
  }

  handleGenerateBoard() {
    const newBoard = this.state.boardValues;
    for (let i = 0; i < this.boardHeight; i += 1) {
      let row = '';
      if (newBoard[i] && newBoard[i].row) {
        if (newBoard[i].row.length >= this.boardWidth) {
          row = newBoard[i].row.substring(0, this.boardWidth);
        } else {
          row = newBoard[i].row + '*'.repeat(this.boardWidth - newBoard[i].row.length);
        }
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

    const questionTitle = this.state.crossQuizQuestion;
    const metaAtributes = { width: this.boardWidth, height: this.boardHeight };
    const rowsAttributes = newBoard;
    const hintsAttributes = this.state.hintsAttributes;

    // Send Match Data to MainQuizGenerator
    this.props.updateParent(questionTitle, metaAtributes, rowsAttributes, hintsAttributes);
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

          <b>Question: </b>
          <input
            type="text"
            name="crossQuizTitle"
            className="quizTitleInput"
            value={this.state.matchQuizQuestion}
            placeholder={this.state.quizTitlePlaceHolder}
            onChange={e => this.handleQuestionInputChange(e)}
          />

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
