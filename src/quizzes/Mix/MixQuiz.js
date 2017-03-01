import React, { PropTypes, Component } from 'react';
import { WordButton } from './index';

export default class MixQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonsArray: [],
      topArray: [],
      bottomArray: [],
    };
  }
  componentWillMount() {
    const emptyArray = [];
    const wordArray = [];
    this.props.question.words.map((word, index) => {
      emptyArray.push(index);
      const id = index;
      wordArray.push(<WordButton
        key={id} text={word} reviewState={this.props.reviewState}
        resultsState={this.props.resultsState} onClick={() =>
        this.handleClick(index)}
      />);
      return (' ');
    },
    );
    this.setState({
      buttonsArray: wordArray,
      bottomArray: emptyArray,

    });
  }

  handleClick(index) {
    const bArray = this.state.bottomArray;
    const tArray = this.state.topArray;
    if (bArray[index] !== null) {
      tArray.push(index);
      bArray[index] = null;
    } else {
      const pos = tArray.indexOf(index);
      bArray[index] = index;
      tArray.splice(pos, 1);
    }
    this.setState({
      topArray: tArray,
      bottomArray: bArray,
    });
    const solutionSoFar = [];
    this.state.topArray.map(position =>
    solutionSoFar.push(this.props.question.words[position]));
    this.props.callbackParent(this.props.question.id, solutionSoFar);
  }

  renderButtons(iArray) {
    const returnedArray = [];
    for (let i = 0; i < iArray.length; i += 1) {
      if (iArray[i] !== null) {
        returnedArray.push(<WordButton
          key={iArray[i]} text={this.props.question.words[iArray[i]]}
          reviewState={this.props.reviewState}
          resultsState={this.props.resultsState} onClick={() =>
          this.handleClick(iArray[i])}
        />);
      }
    }
    return returnedArray;
  }
  // this.props.correctAnswer.correct_sentences gives the solution array;


  render() {
    if (this.props.resultsState) {
      const correctAnswer = this.props.correctAnswer;
      if (correctAnswer && this.props.correctAnswer.correct) {
        this.answerClass = 'correctAnswerWrapper';
      } else {
        this.answerClass = 'wrongAnswerWrapper';
      }
    }
    const styleClasses = `mixQuizContainer ${this.answerClass}`;
    return (
      <div className={styleClasses}>
        <h3>{this.props.index}. {this.props.question.question}</h3>
        <div className="solutionContainer" id="solutionContainer">
          Your solution so far: {this.renderButtons(this.state.topArray)}
        </div>
        <div className="wordsContainer" id="wordsContainer">
          {this.renderButtons(this.state.bottomArray)}
        </div>
      </div>
    );
  }
}

MixQuiz.propTypes = {
  question: PropTypes.shape({
    id: PropTypes.number.isRequired,
    question: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    words: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired }).isRequired,
  reviewState: PropTypes.bool.isRequired,
  resultsState: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
};
