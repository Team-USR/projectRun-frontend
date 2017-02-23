import React, { Component, PropTypes } from 'react';
import { Board } from './index';
import '../../style/Cross.css';

export default class CrossQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      crossQuizId: this.props.question.id,
      crossQuizTitle: this.props.question.question,
      crossQuizIndex: this.props.index,
      crossQuizQuestions: {},
      squares: [
        [
          { type: 'black', value: 'A' },
          { type: 'clickable', value: 'C' },
          { type: 'static', value: 'E' },
          { type: 'clickable', value: 'O' },
        ],
        [
          { type: 'clickable', value: 'B' },
          { type: 'static', value: 'A' },
          { type: 'static', value: 'C' },
          { type: 'static', value: 'K' },
        ],
        [
          { type: 'black', value: 'A' },
          { type: 'static', value: 'R' },
          { type: 'black', value: 'C' },
          { type: 'black', value: 'D' },
        ],
        [
          { type: 'clickable', value: 'U' },
          { type: 'static', value: 'S' },
          { type: 'static', value: 'R' },
          { type: 'black', value: 'D' },
        ],
      ],
      size: 5,
    };
  }

  handleClick(i) {
    const newSquares = this.state.squares.slice();
    newSquares[i] = 'X';
    this.setState({ squares: newSquares });
  }

  render() {
    const crossQuizTitle = this.state.crossQuizTitle;
    const quizIndex = this.state.crossQuizIndex;

    return (
      <div className="crossQuizContainer">

        <div className="matchQuizTitle">
          <h3> { quizIndex }. { crossQuizTitle } </h3>
        </div>

        <div className="leftColumn">
          <div>
            <h4> 1. Across: Follow the instructions</h4>
            <h4> 2. Down: Follow the instructions</h4>
          </div>
          <ol>{/* TODO */}</ol>
        </div>

        <div className="rightColumn">
          <div className="crossBoard">
            <Board
              inReview={this.props.reviewState}
              inResult={this.props.resultsState}
              size={this.state.size}
              squares={this.state.squares}
              onClick={i => this.handleClick(i)}
              onChange={answers =>
                this.props.callbackParent(this.state.matchQuizId, answers)
              }
            />
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
    question: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  callbackParent: PropTypes.func.isRequired,
};
