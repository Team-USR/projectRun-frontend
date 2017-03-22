import React, { Component, PropTypes } from 'react';
import { MatchLeftElement, MatchRightElement } from './index';

export default class MatchQuiz extends Component {

  /** TODO: Move it somewhere else
 * Shuffles array in place. ES6 version
 * @param {Array} toBeShuffled  The array containing the items.
 * @return {Array} shuffledArray  The array with shuffled elements.
 */
  static shuffleArray(toBeShuffled) {
    const shuffledArray = toBeShuffled;
    for (let i = toBeShuffled.length; i; i -= 1) {
      const j = Math.floor(Math.random() * i);
      [shuffledArray[i - 1], shuffledArray[j]] = [toBeShuffled[j], toBeShuffled[i - 1]];
    }

    return shuffledArray;
  }

  constructor(props) {
    super(props);
    this.state = {
      matchQuizId: this.props.question.id,
      matchQuizTitle: this.props.question.question,
      matchQuizIndex: this.props.index,
      matchQuizQuestions: {
        leftElements: this.props.question.left,
        rightElements: this.props.question.right,
        defaultValue: { id: '000', answer: this.props.question.match_default },
      },

      // TEST Input state object for Match Quiz
      matchQuizQuestionsTest:
      {
        leftElements: [
          { id: '001', answer: 'Apple' },
          { id: '002', answer: 'Plum' },
          { id: '003', answer: 'Peach' },
          { id: '004', answer: 'Cherry' },
          { id: '005', answer: 'Lemon' },
        ],
        rightElements: [
          { id: '101', answer: 'Purple' },
          { id: '202', answer: 'Green' },
          { id: '303', answer: 'Red' },
          { id: '404', answer: 'Yellow' },
          { id: '505', answer: 'Orange' },
        ],
        defaultValue: { id: '000', answer: 'Choose a value!' },
      },
      matchQuizAnswers: {
        '001': '202',
        '002': '101',
        '003': '505',
        '004': '303',
        '005': '404',
      },
    };

    const matchQuizQuestions = this.state.matchQuizQuestions;
    const leftElements = matchQuizQuestions.leftElements;
    const rightElements = matchQuizQuestions.rightElements;

    this.leftColumnShuffled = leftElements;
    this.rightColumnShuffled = rightElements;
    if (!this.props.reviewState) {
      this.leftColumnShuffled = MatchQuiz.shuffleArray(leftElements);
      this.rightColumnShuffled = MatchQuiz.shuffleArray(rightElements);
    }
  }

  checkAnswers(answers) {
    let correct = 0;
    for (let i = 0; i < answers.length; i += 1) {
      if (answers[i] && this.state.matchQuizAnswers[answers[i].leftID]) {
        if (this.state.matchQuizAnswers[answers[i].leftID] === answers[i].rightID) {
          correct += 1;
        }
      }
    }
    correct /= this.leftColumnShuffled.length;
    const percentage = correct * 100;
    return percentage;
  }

  renderLeftElement(obj) {
    this.obj = obj;
    const leftElement = (
      <MatchLeftElement
        id={obj.id}
        answer={obj.answer}
        key={obj.id}
      />
    );
    return leftElement;
  }

  renderRightElement(obj, index) {
    this.obj = obj;
    const defaultOption = this.state.matchQuizQuestions.defaultValue;
    let rightElements = this.rightColumnShuffled;
    let leftElements = this.leftColumnShuffled;
    if (this.props.reviewState) {
      rightElements = this.props.question.right;
      leftElements = this.props.question.left;
    }
    const rightElement = (
      <MatchRightElement
        rightElements={rightElements}
        leftElements={leftElements}
        defaultValue={defaultOption}
        inReview={this.props.reviewState}
        inResult={this.props.resultsState}
        onChange={
          answers =>
          this.props.callbackParent(this.state.matchQuizId, answers)}
        index={index}
        key={obj.id}
      />
    );
    return rightElement;
  }

  render() {
    const leftElements = this.leftColumnShuffled;
    const rightElements = this.rightColumnShuffled;
    const matchQuizTitle = this.state.matchQuizTitle;
    const quizIndex = this.state.matchQuizIndex;
    this.answerClass = '';

    if (this.props.resultsState) {
      const correctAnswer = this.props.correctAnswer;
      if (correctAnswer && correctAnswer.correct) {
        this.answerClass = 'correctAnswerWrapper';
      } else {
        this.answerClass = 'wrongAnswerWrapper';
      }
    }

    const styleClasses = `matchQuizContainer ${this.answerClass}`;
    const matchQuiz = (
      <div className={styleClasses}>

        <div className="matchQuizTitle">
          <h3> { quizIndex }. { matchQuizTitle } </h3>
        </div>

        { /* Display Left Column */ }
        <div className="leftColumn">
          { leftElements.map(obj => this.renderLeftElement(obj)) }
        </div>

        { /* Display Right Column */ }
        <div className="rightColumn">
          { rightElements.map((obj, index) =>
              this.renderRightElement(obj, index))
          }
        </div>
      </div>
    );
    return matchQuiz;
  }
}

MatchQuiz.propTypes = {
  reviewState: PropTypes.bool.isRequired,
  resultsState: PropTypes.bool.isRequired,
  question: PropTypes.shape({
    id: PropTypes.number.isRequired,
    question: PropTypes.string.isRequired,
    match_default: PropTypes.string.isRequired,
    left: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired,
    })).isRequired,
    right: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired,
    })).isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  correctAnswer: PropTypes.shape({
    correct: PropTypes.bool,
    correct_answers: PropTypes.arrayOf(PropTypes.number),
  }),
  callbackParent: PropTypes.func.isRequired,
};

MatchQuiz.defaultProps = {
  correctAnswer: {
    correct: false,
    correct_answers: [],
  },
};
