import React, { Component, PropTypes } from 'react';
// import { Col } from 'react-bootstrap';
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
    console.log(this.props);

    const hints = this.props.question.hints;

    console.log(hints);
    const width = this.props.question.width;
    const height = this.props.question.height;
    const newDownHints = [];
    const newAcrossHints = [];


    // Split Down and Accross Hints into 2 arrays
    hints.map((obj) => {
      if (obj.across) {
        newAcrossHints.push(obj);
      } else {
        newDownHints.push(obj);
      }
      return obj;
    });


    // Generate a MAtrix of 0's
    const matrix = [];
    for (let i = 0; i < width; i += 1) {
      const row = [];
      for (let j = 0; j < height; j += 1) {
        row.push(0);
      }
      matrix[i] = row;
    }

    this.setState({
      acrossHints: newAcrossHints,
      downHints: newDownHints,
      // hintsNumbers: matrix,
    });

    // if (this.props.reviewState) {
    //   this.setState({
    //     width: this.props.question.width,
    //     height: this.props.question.height,
    //     boardValues: this.props.question.rows,
    //   });
    // }
    this.generateHintsNumbers(matrix, hints);
  }

  handleClick(i) {
    const newSquares = this.state.squares.slice();
    newSquares[i] = 'X';
    this.setState({ squares: newSquares });
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
    console.log();
    // const hintsNoMatrix = [];

    let currentNo = 1;
    const width = this.state.width;
    const height = this.state.height;
    for (let i = 0; i < width; i += 1) {
      for (let j = 0; j < height; j += 1) {
        const myWord = this.findWordByPosition(hints, i, j);
        if (myWord !== -1) {
          // console.log(myWord.hint);
          hintsNoMatrix[i][j] = currentNo;
          currentNo += 1;
        }
      }
    }
    // hintsNoMatrix = [
    //   [1, 2, 0, 0, 0],
    //   [0, 3, 4, 0, 0],
    //   [0, 0, 5, 6, 0],
    //   [0, 0, 0, 7, 8],
    //   [0, 0, 0, 0, 0],
    // ];
    console.log(hintsNoMatrix);
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
              <h5>
                <b>
                  { hintsNumbers[obj.row][obj.column] }
                  :
                  { obj.hint }
                </b>
              </h5>
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
      <div>
        { acrossHints.map((obj, i) => {
          const index = i;
          return (

            <div key={`across_hint${index}`}>
              <h5>
                <b>
                  { hintsNumbers[obj.row][obj.column] }
                  :
                  { obj.hint }
                </b>
              </h5>
            </div>
          );
        })
        }
      </div>
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
          content={this.props.question.rows}
          squares={this.state.squares}
          onClick={i => this.handleClick(i)}
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

    return (
      <div className="crossQuizContainer">

        <div className="matchQuizTitle">
          <h3> { quizIndex }. { crossQuizQuestion } </h3>
        </div>

        <div className="">
          { this.renderBoard() }
        </div>

        <div className="">
          <div>
            <h4> Across: </h4>
            { this.renderAcrossHints() }
            <hr />
            <h4> Down: </h4>
            { this.renderDownHints() }
          </div>
        </div>


      </div>
    );
  }
}

CrossQuiz.propTypes = {
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
  }).isRequired,
  index: PropTypes.number.isRequired,
  callbackParent: PropTypes.func.isRequired,
};
