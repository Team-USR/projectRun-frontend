import React, { Component, PropTypes } from 'react';
import { Col, Clearfix } from 'react-bootstrap';
import { Board } from './index';


export default class CrossQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      crossQuizId: this.props.question.id,
      crossQuizQuestion: this.props.question.question,
      crossQuizIndex: this.props.index,
      width: this.props.question.width,
      height: this.props.question.height,
      boardValues: this.props.question.rows,
      downHints: [],
      acrossHints: [],
      hintsNumbers: [[]],
    };

    this.generateHintsNumbers = this.generateHintsNumbers.bind(this);
  }

  componentWillMount() {
    const hints = this.props.question.hints;
    const width = this.props.question.width;
    const height = this.props.question.height;
    let newDownHints = [];
    let newAcrossHints = [];

    // Split Down and Accross Hints into 2 arrays
    hints.map((obj) => {
      if (obj.across) {
        newAcrossHints.push(obj);
      } else {
        newDownHints.push(obj);
      }
      return obj;
    });

    // Generate a Matrix of 0's
    const matrix = [];
    for (let i = 0; i < height; i += 1) {
      const row = [];
      for (let j = 0; j < width; j += 1) {
        row.push(0);
      }
      matrix[i] = row;
    }

    newAcrossHints = newAcrossHints.reverse();
    newDownHints = newDownHints.reverse();

    this.setState({
      acrossHints: newAcrossHints,
      downHints: newDownHints,
    });

    this.generateHintsNumbers(matrix, hints);

    if (this.props.sessionAnswers && this.props.sessionAnswers.rows) {
      this.setState({
        boardValues: this.props.sessionAnswers.rows,
      });
    }
  }

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
    let changedRow = newBoard[i];


    // Check if the value of square was deleted or is a space
    //  replace it with '*' in boardValues
    let newSquareValue = event.target.value;
    if (newSquareValue === '' || newSquareValue === ' ') {
      newSquareValue = '_';
    }

    // Update the board
    changedRow = changedRow.substr(0, j) + newSquareValue + changedRow.substr(j + 1);
    newBoard[i] = changedRow;
    this.setState({ boardValues: newBoard });

    // Send Match Data to MainQuizGenerator
    this.props.callbackParent(this.props.id, newBoard);
  }


  findWordByPosition(hints, x, y) {
    this.h = this.props.question.hints;
    for (let i = 0; i < hints.length; i += 1) {
      if (hints[i].row === x && hints[i].column === y) {
        return hints[i];
      }
    }
    return -1;
  }

  generateHintsNumbers(matrix, hints) {
    const hintsNoMatrix = matrix;

    let currentNo = 1;
    const width = this.state.width;
    const height = this.state.height;
    for (let i = 0; i < height; i += 1) {
      for (let j = 0; j < width; j += 1) {
        const myWord = this.findWordByPosition(hints, i, j);
        if (myWord !== -1) {
          hintsNoMatrix[i][j] = currentNo;
          currentNo += 1;
        }
      }
    }
    this.setState({ hintsNumbers: hintsNoMatrix });
  }

  renderDownHints() {
    const downHints = this.state.downHints;
    const hintsNumbers = this.state.hintsNumbers;

    return (
      <div>
        { downHints.map((obj, i) => {
          const index = i;
          return (
            <div key={`down_hint${index}`}>
              <h4>
                <b>
                  { ` ${hintsNumbers[obj.row][obj.column]}: ` }
                </b>
                { obj.hint }
              </h4>
            </div>
          );
        })
        }
      </div>
    );
  }

  renderAcrossHints() {
    const acrossHints = this.state.acrossHints;
    const hintsNumbers = this.state.hintsNumbers;

    return (
      <Col md={12}>
        { acrossHints.map((obj, i) => {
          const index = i;
          return (

            <div key={`across_hint${index}`}>
              <h4>
                <b>
                  { ` ${hintsNumbers[obj.row][obj.column]}: ` }
                </b>
                { obj.hint }
              </h4>
            </div>
          );
        })
        }
      </Col>
    );
  }

  renderBoard() {
    return (
      <div className="crossBoard">
        <Board
          inReview={this.props.reviewState}
          inResult={this.props.resultsState}
          height={this.props.question.height}
          width={this.props.question.width}
          hintsNumbers={this.state.hintsNumbers}
          sessionAnswers={this.props.sessionAnswers}
          content={this.props.question.rows}
          handleSquareChange={(e, i, j) => this.handleSquareChange(e, i, j)}
          onChange={answers =>
            this.props.callbackParent(this.state.matchQuizId, answers)
          }
        />
      </div>
    );
  }

  render() {
    const crossQuizQuestion = this.state.crossQuizQuestion;
    const quizIndex = this.state.crossQuizIndex;


    this.answerClass = '';

    if (this.props.resultsState) {
      const correctAnswer = this.props.correctAnswer;
      if (correctAnswer && correctAnswer.correct) {
        this.answerClass = 'correctAnswerWrapper';
      } else {
        this.answerClass = 'wrongAnswerWrapper';
      }
    }

    const styleClasses = `cardSection crossQuizContainer ${this.answerClass}`;

    return (
      <div className={styleClasses}>

        <div className="matchQuizTitle">
          <h3> <b> { quizIndex + 1 }. { crossQuizQuestion } </b> </h3>
          <h5> <b>Points:</b> {this.props.question.points}</h5>
        </div>

        <div className="">
          { this.renderBoard() }
        </div>

        <Col md={12}>
          <h3> <b> Across </b> </h3>
          { this.renderAcrossHints() }
          <hr />
          <h3> <b> Down </b> </h3>
          { this.renderDownHints() }
        </Col>

        <Clearfix />
      </div>
    );
  }
}

CrossQuiz.propTypes = {
  id: PropTypes.number.isRequired,
  reviewState: PropTypes.bool.isRequired,
  resultsState: PropTypes.bool.isRequired,
  question: PropTypes.shape({
    id: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    hints: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    rows: PropTypes.arrayOf(PropTypes.string).isRequired,
    question: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    points: PropTypes.number.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  callbackParent: PropTypes.func.isRequired,
  sessionAnswers: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.string),
  }),
  correctAnswer: PropTypes.shape({
    correct: PropTypes.bool,
    correct_answers: PropTypes.arrayOf(PropTypes.number),
  }),
};

CrossQuiz.defaultProps = {
  sessionAnswers: null,
  correctAnswer: {
    correct: false,
    correct_answers: [],
  },
};
