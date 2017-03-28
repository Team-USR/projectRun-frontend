import React, { PropTypes, Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { WordButton } from './index';

/**
 * Component that renders a Mix quiz
 * @type {Object}
 */
export default class MixQuiz extends Component {
  /**
   * Component constructor
   * @param  {Object} props object received from the parent
   */
  constructor(props) {
    super(props);
    this.state = {
      buttonsArray: [],
      topArray: [],
      bottomArray: [],
    };
  }
  /**
   * Special React method that is called before the component has mounted and
   * fills the state with data received from props if the user is not in teacher mode
   */
  componentWillMount() {
    const emptyArray = [];
    const wordArray = [];
    const sessionArray = [];
    if (!this.props.teacherView) {
      if (this.props.sessionAnswers === null) {
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
      } else {
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
        const savedAns = this.props.sessionAnswers.answer;
        for (let i = 0; i < savedAns.length; i += 1) {
          sessionArray.push(this.props.question.words.indexOf(savedAns[i]));
          emptyArray[this.props.question.words.indexOf(savedAns[i])] = null;
        }
      }
    }
    this.setState({
      buttonsArray: wordArray,
      bottomArray: emptyArray,
      topArray: sessionArray,
    });
  }
  /**
   * Event handler that moves a button from a "solution" state to a "not-used" one
   * and vice-versa and sends the new states to the parent.
   * @param  {Number} index the index of the button clicked
   */
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
  /**
   * Method that creates an array of html elements based on the array received
   * @param  {Array} iArray array of positions
   * @return {Array}        array of html elements
   */
  renderButtons(iArray) {
    const returnedArray = [];
    for (let i = 0; i < iArray.length; i += 1) {
      if (iArray[i] !== null) {
        returnedArray.push(<WordButton
          key={`mix_button_${iArray[i]}`} text={this.props.question.words[iArray[i]]}
          reviewState={this.props.reviewState}
          resultsState={this.props.resultsState} onClick={() =>
          this.handleClick(iArray[i])}
        />);
      }
    }
    return returnedArray;
  }
  /**
   * Method that renders content depending on the user mode. If the mode is set
   * to teacher, the body rendered contains the current attempt at solving the
   * quiz, else it renders the solutions to the quiz
   * @return {Array} array of html elements
   */
  renderBody() {
    if (!this.props.teacherView) {
      return (<div>
        <div className="solutionContainer" id="solutionContainer">
          <Row className="mix_label">
            <Col md={12}>
              <h4> Your solution so far: </h4>
            </Col>
          </Row>
          <div className="sol_container">{this.renderButtons(this.state.topArray)}</div>
        </div>
        <div className="wordsContainer" id="wordsContainer">
          <Row className="mix_label">
            <Col md={12}>
              <h4> Reorder the following words: </h4>
            </Col>
          </Row>
          {this.renderButtons(this.state.bottomArray)}
        </div>
      </div>);
    }
    const alternateSols = [];
    let mainSolution = null;
    const solutions = this.props.question.sentences;
    for (let i = 0; i < solutions.length; i += 1) {
      if (solutions[i].is_main) {
        mainSolution = <p> {solutions[i].text}</p>;
      } else {
        alternateSols.push(<li className="solution" key={`alternateSol${i}`}>{solutions[i].text}</li>);
      }
    }
    return (
      <div className="solution_container">
        <h4>Main Solution: </h4>
        <h5 className="solution">{mainSolution}</h5>
        {(alternateSols.length !== 0 && (<h4>Alternative Solutions: </h4>))}
        <ul className="alternative_solutions">
          {alternateSols}
        </ul>
      </div>
    );
  }
  /**
   * Component render method
   * @return {Array} Component instance
   */
  render() {
    if (this.props.resultsState) {
      const correctAnswer = this.props.correctAnswer;
      if (correctAnswer && this.props.correctAnswer.correct) {
        this.answerClass = 'correctAnswerWrapper';
      } else {
        this.answerClass = 'wrongAnswerWrapper';
      }
    }
    const styleClasses = `cardSection ${this.answerClass}`;
    return (
      <div className={styleClasses}>
        <h3>{this.props.index + 1}. {this.props.question.question}</h3>
        <h5>Points: {this.props.question.points}</h5>
        {this.renderBody()}
      </div>
    );
  }
}

MixQuiz.propTypes = {
  callbackParent: PropTypes.func.isRequired,
  question: PropTypes.shape({
    id: PropTypes.number.isRequired,
    question: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    points: PropTypes.number.isRequired,
    sentences: PropTypes.arrayOf(PropTypes.object.isRequired),
    words: PropTypes.arrayOf(PropTypes.string.isRequired) }).isRequired,
  reviewState: PropTypes.bool,
  resultsState: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  correctAnswer: PropTypes.shape({
    correct: PropTypes.bool,
    correct_sentences: PropTypes.arrayOf(PropTypes.string),
  }),
  teacherView: PropTypes.bool,
  sessionAnswers: PropTypes.shape({
    answer: PropTypes.arrayOf(PropTypes.string),
  }),
};

MixQuiz.defaultProps = {
  correctAnswer: {
    correct: false,
    correct_sentences: [],
  },
  reviewState: false,
  teacherView: false,
  sessionAnswers: null,
};
