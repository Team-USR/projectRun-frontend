import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import Popup from 'react-popup';
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
      acrossWords: [],
      downWords: [],
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

    // Check if the value of square was deleted or is a space
    //  replace it with '*' in boardValues
    let newSquareValue = event.target.value;
    if (newSquareValue === '' || newSquareValue === ' ') {
      newSquareValue = '*';
    }

    // Update the board
    changedRow = changedRow.substr(0, j) + newSquareValue + changedRow.substr(j + 1);
    newBoard[i].row = changedRow;
    this.setState({ boardValues: newBoard });

    // Update Across and Down Words
    this.generateWords(i, j);

    const questionTitle = this.state.crossQuizQuestion;
    const metaAtributes = { width: this.state.boardWidth, height: this.state.boardHeight };
    const rowsAttributes = newBoard;
    const hintsAttributes = this.state.hintsAttributes;

    // Send Match Data to MainQuizGenerator
    this.props.updateParent(questionTitle, metaAtributes, rowsAttributes, hintsAttributes);
  }

  handleClearBoard() {
    Popup.create({
      title: 'Clear the Board ? ',
      content: 'Are you sure that you want to clear the board? \n This is an irreversible action which will affect the stored words! ',
      buttons: {
        right: [{
          text: 'Clear Board',
          className: 'danger',
          action: () => {
            const newBoard = this.state.boardValues;
            for (let i = 0; i < this.boardHeight; i += 1) {
              const row = '*'.repeat(this.boardWidth);
              newBoard[i] = { row };
            }

            this.setState({
              boardValues: newBoard,
              hintsAttributes: [],
              acrossWords: [],
              downWords: [],
            });

            Popup.close();
          },
        }],
        left: [{
          text: 'Cancel',
          action: () => Popup.close(),
        }],
      },
    });
  }

  handleGenerateBoard() {
    if (this.boardHeight > 30 || this.boardWidth > 30) {
      Popup.alert(
        'The board size should not be larger than 30 x 30. Thank you! :)',
        'Oops! Board Limits exceeded!',
      );
    } else if (this.boardHeight < 1 || this.boardWidth < 1) {
      Popup.alert(
        'The board should contain at least 1 row or 1 column. Thank you! :)',
        'Oops! The Board is too small!',
      );
    } else {
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
  }

  generateWords(row, col) {
    // console.log(row, col);
    const rowString = this.state.boardValues[row].row;
    const rowSplitArray = rowString.split('*');

    const generatedRowWords = rowSplitArray.filter((word) => {
      if (word.length > 1) {
        return true;
      }
      return false;
    });

    let colString = '';
    for (let i = 0; i < this.state.boardHeight; i += 1) {
      colString += this.state.boardValues[i].row[col];
    }

    const colSplitArray = colString.split('*');
    const generatedColWords = colSplitArray.filter((word) => {
      if (word.length > 1) {
        return true;
      }
      return false;
    });

    console.log(generatedRowWords);
    console.log(generatedColWords);

    // Update generatedWords Arrays
    const newDownWords = this.state.downWords;
    newDownWords[col] = generatedColWords;
    const newAcrossWords = this.state.acrossWords;
    newAcrossWords[row] = generatedRowWords;

    this.setState({ downWords: newDownWords, acrossWords: newAcrossWords });
  }

  renderBoard() {
    this.board = 'board';
    let board = (null);
    if (this.state.showBoard) {
      board = (
        <div className="crossBoardPanel">
          <Button onClick={() => this.handleClearBoard()}>Clear Board</Button>
          <Board
            content={this.state.boardValues}
            width={this.state.boardWidth}
            height={this.state.boardHeight}
            handleSquareChange={(e, i, j) => this.handleSquareChange(e, i, j)}
          />
        </div>
        );
    }

    return board;
  }

  renderGeneratedWords() {
    if (this.state.showBoard) {
      return (
        <div>
          <div>
            <h3>Across:</h3>
            { this.state.acrossWords.map(array =>
              array.map(text =>
                  (<span><b>{text}</b><br /></span>),
                ),
              )
            }
          </div>

          <div>
            <h3>Down:</h3>
            { this.state.downWords.map(array =>
              array.map(text =>
                  (<span><b>{text}</b><br /></span>),
                ),
              )
            }
          </div>
        </div>
      );
    }
    return (null);
  }

  render() {
    return (
      <div className="crossQuizGenerator">
        <Popup
          className="mm-popup"
          btnClass="mm-popup__btn"
          closeBtn
          defaultOk="Ok"
          wildClasses={false}
        />
        <div className="createCrossQuizTitle">
          <h3>Cross question</h3>
        </div>
        <div className="createCrossQuizContent">
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
          { this.renderGeneratedWords() }
        </div>
      </div>
    );
  }
}

CrossQuizGenerator.propTypes = {
  updateParent: PropTypes.func.isRequired,
};
