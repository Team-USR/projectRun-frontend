import React, { Component, PropTypes } from 'react';
import { Col } from 'react-bootstrap';
import { MatchLeftElement, MatchRightElement, setAnswersArray } from './index';

export default class MatchQuiz extends Component {

  /**
 * This function shuffles array in place ES6 version
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

  /**
  * This is the Main Constructor for MatchQuiz Class
  * @param {Object} props object of properties
  */
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
      sessionAnswers: {},
      sessionAnswersRL: {},

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

    this.rightAnswers = {};

    this.leftColumnShuffled = leftElements;
    this.rightColumnShuffled = rightElements;
    if (!this.props.reviewState) {
      this.leftColumnShuffled = MatchQuiz.shuffleArray(leftElements);
      this.rightColumnShuffled = MatchQuiz.shuffleArray(rightElements);
    }

    this.findRightElement = this.findRightElement.bind(this);
  }

  /**
  * This function is called before 'render()'
  * It checks if the component receives the sessionAnswers prop
  * in order to store the saved answers from the preious Match quiz session
  * It also updetes its parent calling the function 'callbackParent()'
  */
  componentWillMount() {
    if (this.props.sessionAnswers) {
      const newSessionAnswersObj = {};
      const newAnsRL = {};
      const sessionAnswersArray = this.props.sessionAnswers.pairs;
      sessionAnswersArray.map((obj) => {
        newSessionAnswersObj[obj.left_choice_id] = obj.right_choice_id;
        newAnsRL[obj.right_choice_id] = obj.left_choice_id;
        return obj;
      });

      this.props.callbackParent(this.props.id, this.props.sessionAnswers.pairs);
      this.setState({ sessionAnswers: newSessionAnswersObj, sessionAnswersRL: newAnsRL });
    }
  }

  /**
  * This function is called after 'render()'
  * It is used when the component has the props 'sessionAnswers'
  * in order to set the Answers array from MatchElement.js
  * to the received user answres from the last Session
  */
  componentDidMount() {
    if (this.props.sessionAnswers) {
      const answerSession = [];
      for (const key in this.rightAnswers) {
        if ({}.hasOwnProperty.call(this.rightAnswers, key)) {
          const rightId = this.rightAnswers[key].id;
          answerSession[key] = {
            left_choice_id: this.state.sessionAnswersRL[rightId],
            right_choice_id: rightId,
          };
        }
      }

      setAnswersArray(answerSession);
    }
  }

  /**
  * Currently not used
  * This function ca be used to check the validity of the Match answers
  * This functionality has been transfered to the Backend Side to implement negative marking
  * @param {Array} answers  The array of answers.
  * @return {Float} percentage  The result as a percentage.
  */
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

  /**
  * Function used as a helper to find the text of a right element
  * by its id. It returns -1 if not found or the entire object
  * @param {Integer} id  The id of the needed element.
  * @return {Object} right[id] The found object or -1.
  */
  findRightElement(id) {
    const right = this.state.matchQuizQuestions.rightElements;
    for (let i = 0; i < right.length; i += 1) {
      if (right[i].id === id) {
        return right[i];
      }
    }
    return -1;
  }

  /**
  * This function renders each item from the LEFT hand side column in a Match Quiz
  * @param {Object, Integer} obj, index The object of the Left Element and its index.
  * @return {Object} leftElement  The MatchLeftElement Component
  */
  renderLeftElement(obj, index) {
    if (this.props.sessionAnswers) {
      if (this.state.sessionAnswers[obj.id]) {
        const rightId = this.state.sessionAnswers[obj.id];
        const rightElem = this.findRightElement(rightId);

        if (rightElem !== -1) {
          this.rightAnswers[index] = rightElem;
        }
      }
    }

    const leftElement = (
      <MatchLeftElement
        index={index}
        id={obj.id}
        answer={obj.answer}
        key={obj.id}
      />
    );
    return leftElement;
  }

  /**
  * This function renders each item from the RIGHT hand side column in a Match Quiz
  * It uses the Shuffled Left and Right Arrays to displey the dropdowns on the Right
  * @param {Object, Integer} obj, index The object of the Right Element and its index.
  * @return {Object} rightElement  The MatchRightElement Component
  */
  renderRightElement(obj, index) {
    const defaultOption = this.state.matchQuizQuestions.defaultValue;
    let defAnswer = defaultOption;

    if (this.props.sessionAnswers && this.rightAnswers[index]) {
      defAnswer = this.rightAnswers[index];
    }

    let rightElements = this.rightColumnShuffled;
    let leftElements = this.leftColumnShuffled;
    if (this.props.reviewState) {
      rightElements = this.props.question.right;
      leftElements = this.props.question.left;
      defAnswer = rightElements[index];
    }
    const rightElement = (
      <MatchRightElement
        id={obj.id}
        rightElements={rightElements}
        leftElements={leftElements}
        defaultValue={defaultOption}
        defaultAnswer={defAnswer}
        sessionAnswers={this.state.sessionAnswers}
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

  /**
  * This is the main render function which is in charge of displaying
  * the Match Quiz Component. It calls the renderLeftElement() and
  * renderRightElement() functions to render the columns
  * @return {Object} matchQuiz  The Match Quiz Component
  */
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

    const styleClasses = `cardSection matchQuizContainer clearfix ${this.answerClass}`;
    const matchQuiz = (
      <div className={styleClasses}>
        <div className="matchQuizTitle">
          <h3>{ quizIndex + 1}. { matchQuizTitle } </h3>
          <h5> Points: {this.props.question.points}</h5>
        </div>

        { /* Display Left Column */ }
        <Col md={12}>
          <Col md={6}>
            { leftElements.map((obj, index) => this.renderLeftElement(obj, index)) }
          </Col>
          { /* Display Right Column */ }
          <Col md={6}>
            { rightElements.map((obj, index) => this.renderRightElement(obj, index)) }
          </Col>
        </Col>
      </div>
    );
    return matchQuiz;
  }
}

MatchQuiz.propTypes = {
  id: PropTypes.number.isRequired,
  reviewState: PropTypes.bool.isRequired,
  resultsState: PropTypes.bool.isRequired,
  sessionAnswers: PropTypes.shape({
    pairs: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  question: PropTypes.shape({
    id: PropTypes.number.isRequired,
    question: PropTypes.string.isRequired,
    match_default: PropTypes.string.isRequired,
    points: PropTypes.number.isRequired,
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
  sessionAnswers: null,
};
