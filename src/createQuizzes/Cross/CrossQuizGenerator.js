import React, { Component, PropTypes } from 'react';
import { Button, Col } from 'react-bootstrap';
import { ModalError } from '../../components/utils';
import { Board, Crossword, BoardSize } from './index';

export default class CrossQuizGenerator extends Component {
  constructor(props) {
    super(props);
    const minimumBoardSize = 8;
    const maximumBoardSize = 25;
    this.state = {
      quizTitlePlaceHolder: 'Insert a title or a question for this quiz',
      showBoard: false,
      boardWidth: minimumBoardSize,
      boardHeight: minimumBoardSize,
      displayHeight: minimumBoardSize,
      displayWidth: minimumBoardSize,
      maximumBoardLimit: maximumBoardSize,
      boardValues: [{}],
      crossQuizQuestion: '',

      metaAtributes: [],
      hintsAttributes: [],
      acrossWords: [],
      downWords: [],
      inputWords: [],

      showModal: false,
      modalContent: {
        header: 'Error!',
        body: 'The Cross Quiz contains errors',
        buttons: ['close'],
      },
    };

    this.boardWidth = this.state.boardWidth;
    this.boardHeight = this.state.boardHeight;

    this.renderBoard = this.renderBoard.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentWillMount() {
    const content = this.props.content;
    this.handleResizeBoard();

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
      const questionId = this.props.index;

      // Send Match Data to MainQuizGenerator
      this.props.updateParent(
        questionTitle, metaAtributes, rowsAttributes, hintsAttributes, questionId);
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
    return newHintsAttributes;
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
    const questionId = this.props.index;

    // Send Match Data to MainQuizGenerator
    this.props.updateParent(
      questionTitle, metaAtributes, rowsAttributes, hintsAttributes, questionId);
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
    const questionId = this.props.index;

    // Send Match Data to MainQuizGenerator
    this.props.updateParent(
      questionTitle, metaAtributes, rowsAttributes, hintsAttributes, questionId);
  }

  confirmGenerateBoard() {
    if (this.state.inputWords.length < 2) {
      this.openModal({
        header: 'Oops! Words are not valid!',
        body: 'A valid Crossword must contain at least 2 words! Each Word should have minimum 2 characters!',
        buttons: ['close'],
      });
    } else {
      const words = this.state.inputWords;
      const clues = [];

      words.map((word) => {
        clues.push('');
        return word;
      });

      // Create crossword object with the words
      const cw = new Crossword(words, clues);
      const tries = this.state.maximumBoardLimit;

      const grid = cw.getSquareGrid(tries);

      if (grid == null) {
        const badWords = cw.getBadWords();
        const str = [];
        for (let k = 0; k < badWords.length; k += 1) {
          str.push(badWords[k].word);
        }
        this.openModal({
          header: 'Oops! Words are not valid!',
          body: `A grid could not be created with these words :( \n Please remove these words: \n ${str.join(', ')}`,
          buttons: ['close'],
        });
        return;
      }

      const matrix = [];
      for (let i = 0; i < grid.length; i += 1) {
        const arr = grid[i];
        let row = '';
        for (let j = 0; j < arr.length; j += 1) {
          if (arr[j] && arr[j].char) {
            row += arr[j].char.toLowerCase();
          } else {
            row += '*';
          }
        }
        matrix.push({ row });
      }

      this.setState({
        hintsAttributes: [],
      });

      this.generateWordsForEditor(matrix);

      const width = matrix[0].row.length;
      const height = matrix.length;

      this.setState({
        boardWidth: width,
        boardHeight: height,
        displayWidth: width,
        displayHeight: height,
        boardValues: matrix,
      });

      this.boardWidth = width;
      this.boardHeight = height;
      this.closeModal();
    }
  }

  handleGenerateBoard() {
    this.openModal({
      header: 'Generate the Board ? ',
      body: 'Are you sure that you want to generate the board? This is an irreversible action which will affect the currenlty completed board!',
      buttons: ['close', 'generate'],
    });
  }

  confirmClearBoard() {
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

    this.closeModal();
  }

  handleClearBoard() {
    this.openModal({
      header: 'Clear the Board ? ',
      body: 'Are you sure that you want to clear the board? This is an irreversible action which will affect the stored words!',
      buttons: ['close', 'clear'],
    });
  }

  handleResizeBoard() {
    if (isNaN(this.boardHeight) || isNaN(this.boardWidth) ||
      this.boardHeight < 1 || this.boardWidth < 1) {
      this.openModal({
        header: 'Oops! The Board is too small!',
        body: 'The board should contain at least 1 row or 1 column. Thank you! :)',
        buttons: ['close'],
      });
    } else if (this.boardHeight > this.state.maximumBoardLimit ||
        this.boardWidth > this.state.maximumBoardLimit) {
      this.openModal({
        header: 'Oops! Board Limits exceeded!',
        body: `The board size should not be larger than
               ${this.state.maximumBoardLimit} x ${this.state.maximumBoardLimit}.
               Thank you! :)`,
        buttons: ['close'],
      });
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
      const questionId = this.props.index;

      // Send Match Data to MainQuizGenerator
      this.props.updateParent(
        questionTitle, metaAtributes, rowsAttributes, hintsAttributes, questionId);
    }
  }

  handleHeightChange(e) {
    const target = e.target;
    const value = parseInt(target.value, 10);
    this.boardHeight = value;
    this.setState({ displayHeight: value });
  }

  handleWidthChange(e) {
    const target = e.target;
    const value = parseInt(target.value, 10);
    this.boardWidth = value;
    this.setState({ displayWidth: value });
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
    const hintsAttributes = this.updateHintsAttributes(newAcrossWords, newDownWords);

    const questionTitle = this.state.crossQuizQuestion;
    const metaAtributes = { width: this.boardWidth, height: this.boardHeight };
    const rowsAttributes = this.state.boardValues;
    const questionId = this.props.index;

    // Send Match Data to MainQuizGenerator
    this.props.updateParent(
      questionTitle, metaAtributes, rowsAttributes, hintsAttributes, questionId);

    // console.log(this.state.acrossWords);
  }

  handleInputWordsChange(e) {
    const target = e.target;
    const value = target.value;

    let wordsArray = value.split('\n');

    wordsArray = wordsArray.filter((word) => {
      if (word.length > 1 && word.length <= this.state.maximumBoardLimit) {
        return true;
      }
      return false;
    });

    wordsArray = wordsArray.map(word => word.trim());

    this.setState({ inputWords: wordsArray });
  }

  generateWordsForEditor(board) {
    const newAcrossWords = [];
    const newDownWords = [];

    const width = board[0].row.length;
    const height = board.length;

    // Store the positions for Rows - Across Words
    for (let i = 0; i < height; i += 1) {
      const rowString = board[i].row;
      const generatedRowWords = this.getWordsAndPositions(rowString, i, 0, 'across');
      newAcrossWords.push(generatedRowWords);
    }

    // Store the positions for Columns - Down Words
    for (let j = 0; j < width; j += 1) {
      let colString = '';
      for (let i = 0; i < height; i += 1) {
        colString += board[i].row[j];
      }

      const generatedColWords = this.getWordsAndPositions(colString, 0, j, 'down');
      newDownWords.push(generatedColWords);
    }

    // Update TextareaContent and InputWords - for Editor
    const newInputWord = [];
    let newTextAreaContent = '';
    newAcrossWords.map((array) => {
      if (array.length > 0) {
        array.map((word) => {
          if (word.value && word.value.length > 0) {
            newInputWord.push(word.value);
            newTextAreaContent += `${word.value}\n`;
          }
          return word;
        });
      }
      return array;
    });

    newDownWords.map((array) => {
      if (array.length > 0) {
        array.map((word) => {
          if (word.value && word.value.length > 0) {
            newInputWord.push(word.value);
            newTextAreaContent += `${word.value}\n`;
          }
          return word;
        });
      }
      return array;
    });

    this.updateHintsAttributes(newAcrossWords, newDownWords);
    this.setState({
      acrossWords: newAcrossWords,
      downWords: newDownWords,
      textAreaContent: newTextAreaContent,
      inputWords: newInputWord,
    });
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

  closeModal() {
    this.setState({ showModal: false });
  }

  openModal(content) {
    if (content) {
      this.setState({ showModal: true, modalContent: content });
    } else {
      this.setState({ showModal: true });
    }
  }

  renderBoard() {
    let board = (null);
    if (this.state.showBoard) {
      board = (
        <div className="crossBoardPanel">
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

  render() {
    let textAreaContent = '';
    if (this.state.textAreaContent) {
      textAreaContent = this.state.textAreaContent;
    }

    return (
      <div className="crossQuizGenerator">
        <div className="createCrossQuizTitle">
          <h3>Cross question</h3>
        </div>

        <ModalError
          show={this.state.showModal}
          content={this.state.modalContent}
          close={() => this.closeModal()}
          confirmClearBoard={() => this.confirmClearBoard()}
          confirmGenerateBoard={() => this.confirmGenerateBoard()}
        />

        <div className="createCrossQuizContent">

          <Col md={12}>
            <Col md={2}>
              <div>
                <b>Question: </b>
              </div>
            </Col>
            <Col md={10}>
              <input
                type="text"
                name="crossQuizTitle"
                className="quizTitleInput form-control"
                value={this.state.crossQuizQuestion}
                placeholder={this.state.quizTitlePlaceHolder}
                onChange={e => this.handleQuestionInputChange(e)}
              />
            </Col>
          </Col>
          <br />
          <br />
          <Col md={6}>
            <h4><b>Board Size </b></h4>
            <form>
              <BoardSize
                id={'boardWidth'}
                labelValue={'Witdh'}
                size={this.state.displayWidth}
                handleSizeChange={e => this.handleWidthChange(e)}
              />
              <br /> <br />
              <BoardSize
                id={'boardHeight'}
                labelValue={'Height'}
                size={this.state.displayHeight}
                handleSizeChange={e => this.handleHeightChange(e)}
              />
              <br /> <br /> <br />
              <Col md={6}>
                <div>
                  <Button onClick={() => this.handleResizeBoard()}>Resize</Button>
                </div>
              </Col>
              <Col md={6}>
                <div>
                  <Button onClick={() => this.handleClearBoard()}>Clear</Button>
                </div>
              </Col>
            </form>

          </Col>
          <Col md={6}>
            <h4><b>Words</b></h4>
            <div>
              <textarea
                className="form-control"
                rows="4"
                cols="30"
                defaultValue={textAreaContent}
                placeholder="Write your words, each on a different line"
                onChange={e => this.handleInputWordsChange(e)}
              />
            </div>
            <br />
            <div id="crossword">
              <Button onClick={() => this.handleGenerateBoard()}>
                Generate
              </Button>
            </div>
          </Col>
          <div className="clearfix" />
          { this.renderBoard() }
          { this.renderGeneratedWords() }
        </div>
      </div>
    );
  }

}


CrossQuizGenerator.propTypes = {
  index: PropTypes.number.isRequired,
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
