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
    console.log('Will Mount');

    const content = this.props.content;

    const board = content.rows.map(value => ({ row: value }));

    if (content) {
      console.log('reviewState');
      // this.handleGenerateBoard();
      this.generateWordsForEditor(board);

      const reversedHints = content.hints.reverse();

      this.setState({
        showBoard: true,
        boardWidth: content.width,
        boardHeight: content.height,
        crossQuizQuestion: content.question,
        hintsAttributes: reversedHints,
        boardValues: board,
      });
    }
  }

  componentDidMount() {
    // console.log('DID MOUNT');
    // this.updateHintsAttributes();

    // console.log(this.state);
  }

  generateWordsForEditor(board) {
    // console.log(board);

    const newAcrossWords = [];
    const newDownWords = [];

    for (let i = 0; i < this.props.content.height; i += 1) {
      const rowString = board[i].row;
      const rowSplitArray = rowString.split('*');

      const generatedRowWords = [];
      let pos = 0;
      let wordFound = false;

      rowSplitArray.map((element) => {
        if (!wordFound && element === '') {
          pos += 1;
        } else if (!wordFound && element !== '') {
          if (element.length > 1) {
            generatedRowWords.push({
              across: true,
              value: element,
              row: i,
              column: pos,
            });
          }
          pos += element.length;
          wordFound = true;
        } else if (wordFound && element === '') {
          pos += 1;
        } else if (wordFound && element !== '') {
          if (element.length > 1) {
            generatedRowWords.push({
              across: true,
              value: element,
              row: i,
              column: pos + 1,
            });
          }
          pos += element.length + 1;
        }
        return element;
      },
      );

      console.log(generatedRowWords);
      newAcrossWords.push(generatedRowWords);
    }


    for (let j = 0; j < this.props.content.width; j += 1) {
      let colString = '';
      for (let i = 0; i < this.props.content.height; i += 1) {
        colString += board[i].row[j];
      }

      const generatedColWords = [];

      const colSplitArray = colString.split('*');
      console.log(colSplitArray);

      let pos = 0;
      let wordFound = false;
      //
      colSplitArray.map((element) => {
        if (!wordFound && element === '') {
          pos += 1;
        } else if (!wordFound && element !== '') {
          if (element.length > 1) {
            generatedColWords.push({
              across: true,
              value: element,
              row: pos,
              column: j,
            });
          }
          pos += element.length;
          wordFound = true;
        } else if (wordFound && element === '') {
          pos += 1;
        } else if (wordFound && element !== '') {
          if (element.length > 1) {
            generatedColWords.push({
              across: true,
              value: element,
              row: pos + 1,
              column: j,
            });
          }
          pos += element.length + 1;
        }
        return element;
      },
      );

      newDownWords.push(generatedColWords);
    }

    console.log(newAcrossWords, newDownWords);
    this.setState({ acrossWords: newAcrossWords, downWords: newDownWords });
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

  updateHintsAttributes() {
    const newHintsAttributes = [];

    this.state.acrossWords.map((array) => {
      array.map((obj) => {
        // console.log(obj);
        newHintsAttributes.push({
          // word: obj.word,
          hint: obj.clue,
          row: obj.posX,
          column: obj.posY,
          across: true,
        });
        return obj;
      });
      return array;
    });

    this.state.downWords.map((array) => {
      array.map((obj) => {
        // console.log(obj);
        newHintsAttributes.push({
          // word: obj.word,
          hint: obj.clue,
          row: obj.posX,
          column: obj.posY,
          across: false,
        });
        return obj;
      });
      return array;
    });

    // console.log('this', newHintsAttributes);

    this.setState({ hintsAttributes: newHintsAttributes });
  }

  /* Function called everytime when user types in Quiz Title Input */
  handleQuestionInputChange(e) {
    const target = e.target;
    const value = target.value;
    this.setState({ crossQuizQuestion: value });

    // Update hintsAttributes Object
    this.updateHintsAttributes();

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
    this.updateHintsAttributes();

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
      this.updateHintsAttributes();

      const questionTitle = this.state.crossQuizQuestion;
      const metaAtributes = { width: this.boardWidth, height: this.boardHeight };
      const rowsAttributes = newBoard;
      const hintsAttributes = this.state.hintsAttributes;

      // Send Match Data to MainQuizGenerator
      // console.log(this.state);
      this.props.updateParent(questionTitle, metaAtributes, rowsAttributes, hintsAttributes);
    }
  }

  generateWords(board, row, col) {
    // const rowString = this.state.boardValues[row].row;

    console.log(board);

    const rowString = board[row].row;
    const rowSplitArray = rowString.split('*');

    const generatedRowWords = rowSplitArray.filter((word) => {
      if (word.length > 1) {
        return true;
      }
      return false;
    });

    let colString = '';
    for (let i = 0; i < this.state.boardHeight; i += 1) {
      // colString += this.state.boardValues[i].row[col];
      colString += board[i].row[col];
    }

    const colSplitArray = colString.split('*');
    const generatedColWords = colSplitArray.filter((word) => {
      if (word.length > 1) {
        return true;
      }
      return false;
    });

    const newRowPosX = row;
    const newRowPosY = col;

    // const newColPosX = row;
    // const newColPosY = col;

    // console.log(generatedRowWords);
    // console.log(generatedColWords);

    // Update generatedWords Arrays
    const newDownWords = this.state.downWords;

    newDownWords[col] = generatedColWords.map((value, index) => {
      let obj = {};
      if (newDownWords[col][index] && newDownWords[col][index].clue) {
        obj = { word: value,
          clue: newDownWords[col][index].clue,
          posX: newRowPosX,
          posY: newRowPosY,
        };
      } else {
        obj = {
          word: value,
          clue: '',
          posX: newRowPosX,
          posY: newRowPosY,
        };
      }
      return obj;
    });

    // let actionType = '';
    //
    // if (this.state.boardValues[row].row[col] !== '*') {
    //   actionType = 'modified';
    // } else {
    //   actionType = 'deleted';
    // }

    // console.log(actionType);

      // ({ word: value, clue: newDownWords[col][index].clue }));
    const newAcrossWords = this.state.acrossWords;
    const newAccrosArray = generatedRowWords.map((value, index) => {
      // console.log('objes');
      let obj = {
        word: value,
        clue: '',
        posX: row,
        posY: col,
      };

      // if (actionType === 'deleted') {
      //
      // } else if (actionType === 'modified') {
        // newAcrossWords.splice(1, index + 1);
      if (newAcrossWords[row] && newAcrossWords[row][index]) {
        if (newAcrossWords[row].length === generatedRowWords.length) {
          obj = {
            word: value,
            clue: newAcrossWords[row][index].clue,
            posX: newAcrossWords[row][index].posX,
            posY: newAcrossWords[row][index].posY,
          };
        } else if (newAcrossWords[row].length > generatedRowWords.length) {
          console.log('MERGED');
        }
      }
      // }

      return obj;
    });

    if (newAccrosArray.length > 0) {
      newAcrossWords[row] = newAccrosArray;
    }

    // if (this.state.boardValues[row].row[col] !== '*') {
    //   //   console.log('HERE');
    //   for (let j = col - 1; j >= 0; j -= 1) {
    //     newColPosY = 0;
    //     if (this.state.boardValues[row].row[j] === '*') {
    //       newColPosY = j + 1;
    //       break;
    //     }
    //   }
    // } else {
    //
    // }

    // console.log(newAcrossWords[row].length);

    // if (newAcrossWords[row].length < this.state.acrossWords.length) {
    //   newAcrossWords.filter((obj, index) => {
    //     if (
    //       this.state.acrossWords[row][index] &&
    //       newAcrossWords[row][index].clue !== this.state.acrossWords[row][index].clue
    //     ) {
    //       return {
    //         word: newAcrossWords[row][index],
    //         clue: this.state.acrossWords[row][index + 1].clue,
    //       }
    //       ;
    //     }
    //     return newAcrossWords[row][index];
    //   });
    // }

    console.log(generatedColWords, generatedRowWords);
    // this.setState({ downWords: newDownWords, acrossWords: newAcrossWords });
    this.setState({ downWords: generatedColWords, acrossWords: generatedRowWords });
  }

  handleClueChange(e, x, y, clueType) {
    const target = e.target;
    const value = target.value;
    const newAcrossWords = this.state.acrossWords;
    const newDownWords = this.state.downWords;

    if (clueType === 'across') {
      const wordObject = newAcrossWords[x][y];
      wordObject.clue = value;
      newAcrossWords[x][y] = wordObject;
      this.setState({ acrossWords: newAcrossWords });
    } else if (clueType === 'down') {
      const wordObject = newDownWords[x][y];
      wordObject.clue = value;
      newDownWords[x][y] = wordObject;
      this.setState({ downWords: newDownWords });
    }

    // Update hintsAttributes Object
    this.updateHintsAttributes();

    const questionTitle = this.state.crossQuizQuestion;
    const metaAtributes = { width: this.boardWidth, height: this.boardHeight };
    const rowsAttributes = this.state.boardValues;
    const hintsAttributes = this.state.hintsAttributes;

    // Send Match Data to MainQuizGenerator
    this.props.updateParent(questionTitle, metaAtributes, rowsAttributes, hintsAttributes);

    // console.log(this.state.acrossWords);
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
    return (
      <div>
        <label htmlFor="boardClue">{obj.word}</label>
        <input
          id="boardClue"
          type="text"
          onChange={e => this.handleClueChange(e, x, y, clueType)}
          value={obj.clue}
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
  }).isRequired,
  updateParent: PropTypes.func.isRequired,
};
