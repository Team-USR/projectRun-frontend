import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import Popup from 'react-popup';
import { Board } from './index';

export default class CrossQuizGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quizTitlePlaceHolder: 'Insert a title or a question for this quiz',
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

  componentWillMount() {
    // console.log('Will Mount');

    const content = this.props.content;

    if (content) {
      // console.log('reviewState');
      const board = content.rows.map(value => ({ row: value }));
      this.generateWordsForEditor(board);

      this.setState({
        showBoard: true,
        boardWidth: content.width,
        boardHeight: content.height,
        crossQuizQuestion: content.question,
        boardValues: board,
      });

      const questionTitle = content.question;
      const metaAtributes = { width: content.width, height: content.height };
      const rowsAttributes = board;
      const hintsAttributes = content.hints;

      // Send Match Data to MainQuizGenerator
      this.props.updateParent(questionTitle, metaAtributes, rowsAttributes, hintsAttributes);
    }
  }

  getHintByCoordintes(x, y, isAcross) {
    if (this.props.content) {
      const hints = this.props.content.hints;
      for (let i = 0; i < hints.length; i += 1) {
        if (hints[i].row === x && hints[i].column === y && isAcross === hints[i].across) {
          return hints[i];
        }
      }
    }
    return -1;
  }

  getWordsAndPositions(myString, x, y, type) {
    let isAcross = true;
    if (type === 'down') {
      isAcross = false;
    }

    const rowString = myString;
    const rowSplitArray = rowString.split('*');

    const generatedWords = [];
    let pos = 0;
    let wordFound = false;

    rowSplitArray.map((element) => {
      if (!wordFound && element === '') {
        pos += 1;
      } else if (!wordFound && element !== '') {
        if (element.length > 1) {
          let newWordObj = {};
          if (type === 'across') {
            newWordObj = {
              across: isAcross,
              value: element,
              row: x,
              column: pos,
              hintObj: this.getHintByCoordintes(x, pos, isAcross),
            };
          } else if (type === 'down') {
            newWordObj = {
              across: isAcross,
              value: element,
              row: pos,
              column: y,
              hintObj: this.getHintByCoordintes(pos, y, isAcross),
            };
          }
          generatedWords.push(newWordObj);
        }

        pos += element.length;
        wordFound = true;
      } else if (wordFound && element === '') {
        pos += 1;
      } else if (wordFound && element !== '') {
        if (element.length > 1) {
          let newWordObj = {};
          if (type === 'across') {
            newWordObj = {
              across: isAcross,
              value: element,
              row: x,
              column: pos + 1,
              hintObj: this.getHintByCoordintes(x, pos + 1, isAcross),
            };
          } else if (type === 'down') {
            newWordObj = {
              across: isAcross,
              value: element,
              row: pos + 1,
              column: y,
              hintObj: this.getHintByCoordintes(pos + 1, y, isAcross),
            };
          }
          generatedWords.push(newWordObj);
        }
        pos += element.length + 1;
      }
      return element;
    },
    );

    return generatedWords;
  }

  updateHintsAttributes(acrossWords, downWords) {
    const newHintsAttributes = [];


    acrossWords.map((array) => {
      array.map((obj) => {
        let hintValue = '';
        if (obj.hintObj !== -1) {
          hintValue = obj.hintObj.hint;
        }

        newHintsAttributes.push({
          across: obj.across,
          hint: hintValue,
          row: obj.row,
          column: obj.column,
        });
        return obj;
      });
      return array;
    });

    downWords.map((array) => {
      array.map((obj) => {
        let hintValue = '';
        if (obj.hintObj !== -1) {
          hintValue = obj.hintObj.hint;
        }
        newHintsAttributes.push({
          across: obj.across,
          hint: hintValue,
          row: obj.row,
          column: obj.column,
        });
        return obj;
      });
      return array;
    });

    // console.log('this', newHintsAttributes);
    // console.log(this.state);
    this.setState({ hintsAttributes: newHintsAttributes });
  }

  /* Function called everytime when user types in Quiz Title Input */
  handleQuestionInputChange(e) {
    const target = e.target;
    const value = target.value;
    this.setState({ crossQuizQuestion: value });

    // Update hintsAttributes Object
    this.updateHintsAttributes(this.state.acrossWords, this.state.downWords);

    const questionTitle = value;
    const metaAtributes = { width: this.state.boardWidth, height: this.state.boardHeight };
    const rowsAttributes = this.state.boardValues;
    const hintsAttributes = this.state.hintsAttributes;

    // Send Match Data to MainQuizGenerator
    this.props.updateParent(questionTitle, metaAtributes, rowsAttributes, hintsAttributes);
  }

  handleSquareChange(e, i, j) {
    // console.log(this.state.downWords);
    // console.log(this.state.acrossWords);

    const event = e;
    const target = event.target;
    const value = target.value;
    if (value.length > 1) {
      event.target.value = value[1];
    }
    event.target.value = event.target.value.toLowerCase();

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
    this.generateWords(this.state.boardValues, i, j);

    // Update hintsAttributes Object
    this.updateHintsAttributes(this.state.acrossWords, this.state.downWords);

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
    if (isNaN(this.boardHeight) || isNaN(this.boardWidth)) {
      Popup.alert(
        'The board dimensions should be valid numbers. Thank you! :)',
        'Oops! Board Limits incorrect!',
      );
    } else if (this.boardHeight > 30 || this.boardWidth > 30) {
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


      // Update hintsAttributes Object
      this.updateHintsAttributes(this.state.acrossWords, this.state.downWords);

      const questionTitle = this.state.crossQuizQuestion;
      const metaAtributes = { width: this.boardWidth, height: this.boardHeight };
      const rowsAttributes = newBoard;
      const hintsAttributes = this.state.hintsAttributes;

      // Send Match Data to MainQuizGenerator
      // console.log(this.state);
      this.props.updateParent(questionTitle, metaAtributes, rowsAttributes, hintsAttributes);
    }
  }

  handleHeightChange(e) {
    const target = e.target;
    const value = parseInt(target.value, 10);
    this.boardHeight = value;
  }

  handleWidthChange(e) {
    const target = e.target;
    const value = parseInt(target.value, 10);
    this.boardWidth = value;
  }

  handleClueChange(e, x, y, clueType) {
    const target = e.target;
    const value = target.value;
    const newAcrossWords = this.state.acrossWords;
    const newDownWords = this.state.downWords;

    if (clueType === 'across') {
      const wordObject = newAcrossWords[x][y];
      wordObject.hintObj = { hint: value };
      newAcrossWords[x][y] = wordObject;
      this.setState({ acrossWords: newAcrossWords });
    } else if (clueType === 'down') {
      const wordObject = newDownWords[x][y];
      wordObject.hintObj = { hint: value };
      newDownWords[x][y] = wordObject;
      this.setState({ downWords: newDownWords });
    }

    // Update hintsAttributes Object
    this.updateHintsAttributes(newAcrossWords, newDownWords);

    const questionTitle = this.state.crossQuizQuestion;
    const metaAtributes = { width: this.boardWidth, height: this.boardHeight };
    const rowsAttributes = this.state.boardValues;
    const hintsAttributes = this.state.hintsAttributes;

    // Send Match Data to MainQuizGenerator
    this.props.updateParent(questionTitle, metaAtributes, rowsAttributes, hintsAttributes);

    // console.log(this.state.acrossWords);
  }

  generateWordsForEditor(board) {
    const newAcrossWords = [];
    const newDownWords = [];

    // Store the positions for Rows - Across Words
    for (let i = 0; i < this.props.content.height; i += 1) {
      const rowString = board[i].row;
      const generatedRowWords = this.getWordsAndPositions(rowString, i, 0, 'across');
      newAcrossWords.push(generatedRowWords);
    }

    // Store the positions for Columns - Down Words
    for (let j = 0; j < this.props.content.width; j += 1) {
      let colString = '';
      for (let i = 0; i < this.props.content.height; i += 1) {
        colString += board[i].row[j];
      }

      const generatedColWords = this.getWordsAndPositions(colString, 0, j, 'down');
      newDownWords.push(generatedColWords);
    }

    this.updateHintsAttributes(newAcrossWords, newDownWords);
    this.setState({ acrossWords: newAcrossWords, downWords: newDownWords });
  }

  generateWords(board, row, col) {
    // console.log('generateWords - BOARD', board);

    const rowString = board[row].row;
    const newAcrossWords = this.state.acrossWords;
    newAcrossWords[row] = this.getWordsAndPositions(rowString, row, col, 'across');


    let colString = '';
    for (let i = 0; i < this.state.boardHeight; i += 1) {
      colString += board[i].row[col];
    }

    const newDownWords = this.state.downWords;
    newDownWords[col] = this.getWordsAndPositions(colString, row, col, 'down');

    // console.log(newAcrossWords, newDownWords);

    this.setState({ downWords: newDownWords, acrossWords: newAcrossWords });
  }

  renderBoard() {
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

  renderClue(obj, x, y, clueType) {
    let hintValue = '';

    if (obj.hintObj.hint) {
      hintValue = obj.hintObj.hint;
    }

    return (
      <div>
        <label htmlFor="boardClue">{obj.value.toUpperCase()} </label>
        <input
          id="boardClue"
          type="text"
          onChange={e => this.handleClueChange(e, x, y, clueType)}
          defaultValue={hintValue}
        />
      </div>
    );
  }

  renderGeneratedWords() {
    if (this.state.showBoard) {
      return (
        <div>
          <div>
            <h3>Across:</h3>
            { this.state.acrossWords.map((array, x) =>
              array.map((obj, y) => this.renderClue(obj, x, y, 'across')),
              )
            }
          </div>

          <div>
            <h3>Down:</h3>
            { this.state.downWords.map((array, x) =>
              array.map((obj, y) => this.renderClue(obj, x, y, 'down')),
              )
            }
          </div>
        </div>
      );
    }
    return (null);
  }

  renderGenerateBoardButton() {
    return (
      <Button onClick={() => this.handleGenerateBoard()}>Generate</Button>
    );
  }

  render() {
    // console.log('render', this.state);
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
            value={this.state.crossQuizQuestion}
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

            { this.renderGenerateBoardButton() }

          </form>

          { this.renderBoard() }
          { this.renderGeneratedWords() }
        </div>
      </div>
    );
  }
}

CrossQuizGenerator.propTypes = {
  content: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    hints: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }),
  updateParent: PropTypes.func.isRequired,
};

CrossQuizGenerator.defaultProps = {
  content: null,
};
