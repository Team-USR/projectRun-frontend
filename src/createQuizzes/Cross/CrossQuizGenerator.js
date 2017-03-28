import React, { Component, PropTypes } from 'react';
import { Button, Col, Clearfix } from 'react-bootstrap';
import { ModalError } from '../../components/utils';
import { Board, Crossword, BoardSize } from './index';

/**
 * Class that renders the entire the Cross Quiz GEnerator for
 * Teacher Create and Edit Cross quizzes
 * @param {Object} props
 * @type {Object}
 */
export default class CrossQuizGenerator extends Component {
  /**
  * This is the Main Constructor for CrossQuiz Generator Class
  * @param {Object} props object of properties
  */
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

  /**
  * This function is called before 'render()'
  * It also prepares the hints arrays and hint matrix numbers
  * It checks if the component receives the content prop
  * in order to store the saved Cross quiz session
  */
  componentWillMount() {
    const content = this.props.content;
    this.handleResizeBoard();

    if (content) {
      const board = content.rows.map(value => ({ row: value }));
      this.generateWordsForEditor(board, false);

      this.setState({
        showBoard: true,
        boardWidth: content.width,
        boardHeight: content.height,
        displayWidth: content.width,
        displayHeight: content.height,
        crossQuizQuestion: content.question,
        boardValues: board,
      });

      this.boardWidth = content.width;
      this.boardHeight = content.height;

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

  /**
  * Function used as a helper to find a Hint by its coordinates
  * @param {Integer, Integer, Bool} x, y, isAcross
  * @return {Object}  hints[i] or -1
  */
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

  /**
  * Function used as a helper to get a word and
  * its starting positions in a Board
  * It takes a string and uses getHintByCoordintes() Function
  * to make a link between generated words and existing hints
  * @param {Strin, Integer, Integer, String} myString, x, y, type
  * @return {Array}  generatedWords The array of words and its hints
  */
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

  /**
  * This function updates the hintsAttributes to fit the POST request
  * @param {Array, Array} acrossWords, acrossWords
  * @return {Array}  newHintsAttributes The updated array of hints
  */
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

    this.setState({ hintsAttributes: newHintsAttributes });
    return newHintsAttributes;
  }

  /**
  * Function called everytime when user types in Quiz Title Input
  * @param {Event} e  The event triggerd when the Title Inputs is changed
  */
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

  /**
  * Function called everytime when user types in Square Input
  * It stores the value of the input adn updates the generated words
  * and hints. It also trigger the validation function from itr parent.
  * @param {Event, Integerm Integer}
  *        e   The event triggerd when the Square Inputs is changed
  *        i, j  Coordinates
  */
  handleSquareChange(e, i, j) {
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
    const hintsAttributes =
      this.updateHintsAttributes(this.state.acrossWords, this.state.downWords);
    const questionTitle = this.state.crossQuizQuestion;
    const metaAtributes = { width: this.state.boardWidth, height: this.state.boardHeight };
    const rowsAttributes = newBoard;
    const questionId = this.props.index;

    // Send Match Data to MainQuizGenerator
    this.props.updateParent(
      questionTitle, metaAtributes, rowsAttributes, hintsAttributes, questionId);
  }

  /**
  * Function called when the user click and confirm the Generation Button
  * It uses Crossword Component from CrossAutoGenerator to take
  * the input words and create a Cross Board
  */
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

      this.generateWordsForEditor(matrix, true);

      const width = matrix[0].row.length;
      const height = matrix.length;

      this.boardWidth = width;
      this.boardHeight = height;
      this.closeModal();

      this.setState({
        boardWidth: width,
        boardHeight: height,
        displayWidth: width,
        displayHeight: height,
        boardValues: matrix,
        hintsAttributes: [],
      });

      const questionTitle = this.state.crossQuizQuestion;
      const metaAtributes = { width: this.boardWidth, height: this.boardHeight };
      const rowsAttributes = matrix;
      const hintsAttributes = [];
      const questionId = this.props.index;

      // Send Match Data to MainQuizGenerator
      this.props.updateParent(
        questionTitle, metaAtributes, rowsAttributes, hintsAttributes, questionId);
    }
  }

  /*
  * Function caled as a handler for Generate Board click
  * It opens a Modal and ask user for Generate Confirmation
  */
  handleGenerateBoard() {
    this.openModal({
      header: 'Generate the Board ? ',
      body: 'Are you sure that you want to generate the board? This is an irreversible action which will affect the currenlty completed board!',
      buttons: ['close', 'generate'],
    });
  }


  /**
  * Function called when the user click and confirm the Clear Board Button
  * It regenerates a new Clean board and clear the Words and Hints
  */
  confirmClearBoard() {
    const newBoard = this.state.boardValues;
    const currentWidth = this.state.boardWidth;
    const currentHeight = this.state.boardHeight;

    for (let i = 0; i < currentHeight; i += 1) {
      const row = '*'.repeat(currentWidth);
      newBoard[i] = { row };
    }

    this.setState({
      boardValues: newBoard,
      hintsAttributes: [],
      acrossWords: [],
      downWords: [],
    });

    const questionTitle = this.state.crossQuizQuestion;
    const metaAtributes = { width: currentWidth, height: currentHeight };
    const rowsAttributes = newBoard;
    const hintsAttributes = [];
    const questionId = this.props.index;

    // Send Match Data to MainQuizGenerator
    this.props.updateParent(
      questionTitle, metaAtributes, rowsAttributes, hintsAttributes, questionId);

    this.closeModal();
  }

  /*
  * Function called as a handler for Clear Board click
  * It opens a Modal and ask user for Clear Board Confirmation
  */
  handleClearBoard() {
    this.openModal({
      header: 'Clear the Board ? ',
      body: 'Are you sure that you want to clear the board? This is an irreversible action which will affect the stored words!',
      buttons: ['close', 'clear'],
    });
  }

  /**
  * Function used as a helper to check if the board can be
  * resized without cropping the current words
  * @param {Array, Integer, Integer} newBoard, newBoardWidth, newBoardHeight
  * @return {Bool}
  */
  checkIfCropped(newBoard, newBoardWidth, newBoardHeight) {
    let maxRow = 0;
    let maxCol = 0;

    const boardWidth = this.state.boardWidth;
    const boardHeight = this.state.boardHeight;

    // Check if Words are Cropped on Row;
    for (let i = 0; i < boardHeight; i += 1) {
      if (newBoard[i] && newBoard[i].row) {
        const copyRow = newBoard[i].row;
        for (let j = 0; j < boardWidth; j += 1) {
          for (let k = 0; k < copyRow.length; k += 1) {
            if (copyRow[k] !== '*' && maxRow < k) {
              maxRow = k;
            }
          }
        }
      }
    }

    for (let j = 0; j < boardWidth; j += 1) {
      for (let i = 0; i < boardHeight; i += 1) {
        if (newBoard[i] && newBoard[i].row) {
          const copyRow = newBoard[i].row;
          if (copyRow[j] && copyRow[j] !== '*' && maxCol < i) {
            maxCol = i;
          }
        }
      }
    }

    maxRow += 1;
    maxCol += 1;

    if (maxRow > newBoardWidth || maxCol > newBoardHeight) {
      return false;
    }

    return true;
  }

  /*
  * Function called as a handler for Resize Board click
  * It check the diemnsions of the board wich are min 1x1 and max 25x25
  * It opens a Modal depending on the error and
  * resizes the Board if everything is correc
  */
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
      const isPossible = this.checkIfCropped(newBoard, this.boardWidth, this.boardHeight);

      if (isPossible) {
        for (let i = 0; i < this.boardHeight; i += 1) {
          let row = '';
          if (newBoard[i] && newBoard[i].row) {
            if (newBoard[i].row.length >= this.boardWidth) {
              row = newBoard[i].row.substring(0, this.boardWidth);
            } else {
              // Build the new empty Board Row
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
        const hintsAttributes =
          this.updateHintsAttributes(this.state.acrossWords, this.state.downWords);
        const questionTitle = this.state.crossQuizQuestion;
        const metaAtributes = { width: this.boardWidth, height: this.boardHeight };
        const rowsAttributes = newBoard;
        const questionId = this.props.index;

        // Send Match Data to MainQuizGenerator
        this.props.updateParent(
          questionTitle, metaAtributes, rowsAttributes, hintsAttributes, questionId);
      } else {
        this.openModal({
          header: 'Oops! You will crop your words!',
          body: 'The new limits will crop your currently existing words from board! Choose other limits or modify the words.',
          buttons: ['close'],
        });
      }
    }
  }

  /**
  * Function called everytime when user types in Height Input
  * It stores the value of the input
  * @param {Event} e The event triggerd when the Height Inputs is changed
  */
  handleHeightChange(e) {
    const target = e.target;
    const value = parseInt(target.value, 10);
    this.boardHeight = value;
    this.setState({ displayHeight: value });
  }

  /**
  * Function called everytime when user types in Width Input
  * It stores the value of the input
  * @param {Event} e The event triggerd when the Width Inputs is changed
  */
  handleWidthChange(e) {
    const target = e.target;
    const value = parseInt(target.value, 10);
    this.boardWidth = value;
    this.setState({ displayWidth: value });
  }

  /**
  * Function called everytime when user types in Hint Input
  * It stores the value of the input adn updates the generated words
  * and hints. It also trigger the validation function from itr parent.
  * @param {Event, Integer, Integer, String}
  *        e   The event triggerd when the Square Inputs is changed
  *        i, j  Coordinates
  *        clueType  down or across
  */
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
  }

  /**
  * Function called everytime when user types in Words Textarea
  * It stores the value of the input and split the words by newline
  * @param {Event} e The event triggerd when the Words Textarea is changed
  */
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


  /**
  * Function used to generate the board, words and hints for editor
  * It is calle only once in componentWillMount it ther is content prop.
  * @param {Array, Bool} board, clearHints
  */
  generateWordsForEditor(board, clearHints) {
    let newAcrossWords = [];
    let newDownWords = [];

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
    newAcrossWords = newAcrossWords.map((array) => {
      let newArray = array;
      if (array.length > 0) {
        newArray = array.map((word) => {
          if (word.value && word.value.length > 0) {
            newInputWord.push(word.value);
            newTextAreaContent += `${word.value}\n`;
          }
          const newWord = word;
          // Clear Across Hints when Regenerate
          if (clearHints) {
            newWord.hintObj = -1;
          }
          return newWord;
        });
      }
      return newArray;
    });

    newDownWords = newDownWords.map((array) => {
      let newArray = array;
      if (array.length > 0) {
        newArray = array.map((word) => {
          if (word.value && word.value.length > 0) {
            newInputWord.push(word.value);
            newTextAreaContent += `${word.value}\n`;
          }

          const newWord = word;
          // Clear Down Hints when Regenerate
          if (clearHints) {
            newWord.hintObj = -1;
          }
          return newWord;
        });
      }
      return newArray;
    });

    this.updateHintsAttributes(newAcrossWords, newDownWords);
    this.setState({
      acrossWords: newAcrossWords,
      downWords: newDownWords,
      textAreaContent: newTextAreaContent,
      inputWords: newInputWord,
    });
  }

  /**
  * Function used to generate the board, words and hints for Cross Generator
  * It is called every time user types in the board
  * @param {Array, Integer, Integer} board, rom, col
  */
  generateWords(board, row, col) {
    const rowString = board[row].row;
    const newAcrossWords = this.state.acrossWords;
    newAcrossWords[row] = this.getWordsAndPositions(rowString, row, col, 'across');


    let colString = '';
    for (let i = 0; i < this.state.boardHeight; i += 1) {
      colString += board[i].row[col];
    }

    const newDownWords = this.state.downWords;
    newDownWords[col] = this.getWordsAndPositions(colString, row, col, 'down');

    this.setState({ downWords: newDownWords, acrossWords: newAcrossWords });
  }

  /**
  * Function called to close the Error Modal
  */
  closeModal() {
    this.setState({ showModal: false });
  }

  /**
  * Function called to open the Error Modal
  * @param {OBject} content Header, Body, Footer, ModalProps
  */
  openModal(content) {
    if (content) {
      this.setState({ showModal: true, modalContent: content });
    } else {
      this.setState({ showModal: true });
    }
  }

  /**
  * Function that renders the Board using the Board Component
  * All the Event handlers are sent via its props
  * @return {Object} The Board Wrapper
  */
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

  /**
  * Function that renders each Clue and Word pairs
  * The text for labels is transformed tot uppercase
  * @return {Object, Integer, Integer, String} obj, x, y, clueType
  */
  renderClue(obj, x, y, clueType) {
    let hintValue = '';

    if (obj.hintObj.hint) {
      hintValue = obj.hintObj.hint;
    }

    return (
      <Col md={12} className="hintItemWrapper">
        <Col md={2} className="itemLabelContainer">
          <label htmlFor="boardClue">{obj.value.toUpperCase()} </label>
        </Col>
        <Col md={10}>
          <input
            className="form-control"
            id="boardClue"
            type="text"
            onChange={e => this.handleClueChange(e, x, y, clueType)}
            value={hintValue}
          />
        </Col>
      </Col>
    );
  }

  /**
  * Function used to render the list of generated Words
  * It calls the function 'renderClue()' for each item
  * @return {Object} The Hints Wrapper
  */
  renderGeneratedWords() {
    if (this.state.showBoard) {
      return (
        <div className="crossHintsWrapper">
          <Col md={12}>
            <h3>Across</h3>
            { this.state.acrossWords.map((array, x) =>
              array.map((obj, y) => this.renderClue(obj, x, y, 'across')),
              )
            }
          </Col>

          <Col md={12}>
            <h3>Down</h3>
            { this.state.downWords.map((array, x) =>
              array.map((obj, y) => this.renderClue(obj, x, y, 'down')),
              )
            }
          </Col>
        </div>
      );
    }
    return (null);
  }

  /**
  * This is the main render function which is in charge of displaying
  * the Cross Quiz GEnerator Component. It calls the renderBoard(),
  * renderGeneratedWords() functions to render the Board, the words and the hints.
  * All the handlers are sent via the props
  * @return {Object}  The Cross Quiz Viewer Component
  */
  render() {
    let textAreaContent = '';
    if (this.state.textAreaContent) {
      textAreaContent = this.state.textAreaContent;
    }

    return (
      <div className="crossQuizGenerator">
        <div className="createCrossQuizTitle">
          <h3 className="question_title">Cross question</h3>
        </div>

        <ModalError
          show={this.state.showModal}
          content={this.state.modalContent}
          close={() => this.closeModal()}
          confirmClearBoard={() => this.confirmClearBoard()}
          confirmGenerateBoard={() => this.confirmGenerateBoard()}
        />

        <div className="createCrossQuizContent">

          <Col md={12} className="crossQuestionWrapper">
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
          <Col md={12} className="crossInputsWrapper">
            <Col md={6}>
              <h4><b>Board Size </b></h4>
              <form className="crossInputsForm">
                <BoardSize
                  styleClass="sizeLabel"
                  id={'boardWidth'}
                  labelValue={'Width'}
                  size={this.state.displayWidth}
                  handleSizeChange={e => this.handleWidthChange(e)}
                />
                <BoardSize
                  styleClass="sizeLabel bottomHeightBtn"
                  id={'boardHeight'}
                  labelValue={'Height'}
                  size={this.state.displayHeight}
                  handleSizeChange={e => this.handleHeightChange(e)}
                />
                <Clearfix />
              </form>

            </Col>
            <Col md={6}>
              <h4><b>Words</b></h4>
              <form className="crossInputsForm">
                <textarea
                  className="inputWordsTextarea form-control"
                  defaultValue={textAreaContent}
                  placeholder="Write your words, each on a different line"
                  onChange={e => this.handleInputWordsChange(e)}
                />
              </form>
            </Col>
            <Clearfix />
          </Col>

          <Col md={12} className="crossButtonsWrapper">
            <Col md={4}>
              <Button
                className="crossButton"
                onClick={() => this.handleResizeBoard()}
              >
                Resize
              </Button>
            </Col>
            <Col md={4}>
              <Button
                className="crossButton"
                onClick={() => this.handleClearBoard()}
              >
                Clear
              </Button>
            </Col>
            <Col md={4}>
              <Button
                className="crossButton"
                onClick={() => this.handleGenerateBoard()}
              >
                Generate
              </Button>
            </Col>

          </Col>
          <Clearfix />
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
