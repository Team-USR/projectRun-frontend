import React, { PropTypes, Component } from 'react';
import { Col, Row } from 'react-bootstrap';
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
  // this.props.correctAnswer.correct_sentences gives the solutions array;
  renderBody() {
    if (!this.props.teacherView) {
      return (<div>
        <div className="solutionContainer" id="solutionContainer">
          <Row className="mix_label">
            <Col md={12}>
              <b> Your solution so far: </b>
            </Col>
          </Row>
          <div className="sol_container">{this.renderButtons(this.state.topArray)}</div>
        </div>
        <div className="wordsContainer" id="wordsContainer">
          <Row className="mix_label">
            <Col md={12}>
              <b> Reorder the following words: </b>
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
        alternateSols.push(<li key={`alternateSol${i}`}>{solutions[i].text}</li>);
      }
    }
    return (
      <div className="solution_container">
        <b>Main Solution: </b>
        {mainSolution}
        <b>Alternative Solutions: </b>
        <ul className="alternative_solutions">{alternateSols}</ul>
      </div>
    );
  }

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
