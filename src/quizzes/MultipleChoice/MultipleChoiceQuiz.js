import React, { Component, PropTypes } from 'react';
import { QuestionWrapper } from './index';

class MultipleChoiceQuiz extends Component {
  constructor() {
    super();
    this.state = { quizInfo: [],
      loadingQuiz: true,
      loadingAnswers: false,
      answers: [],
      correctAnswers: [],
    };
  }
  onChildChanged(newState) {
    this.setState({ answers: newState });
    this.props.callbackParent(this.props.question.id, newState);
  }
  renderQuestion(question, index, reviewState, resultsState) {
    return (
      <QuestionWrapper
        question={question}
        index={index}
        key={index}
        inReview={reviewState}
        inResultsState={resultsState}
        correctAnswer={this.props.correctAnswer}
        creatorAnswers={this.props.creatorAnswers}
        sessionAnswers={this.props.sessionAnswers}
        myAnswers={this.state.answers}
        callbackParent={newState => this.onChildChanged(newState, index)}
      />
    );
  }

  render() {
    const { index, question, reviewState, resultsState } = this.props;
    return (
      <div className="questionBlock">
        {this.renderQuestion(question, index, reviewState, resultsState)}
      </div>
    );
  }
}
MultipleChoiceQuiz.propTypes = {
  callbackParent: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  reviewState: PropTypes.bool.isRequired,
  resultsState: PropTypes.bool.isRequired,
  question: PropTypes.shape({
    id: PropTypes.number.isRequired,
    question: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    answers: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      answer: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  correctAnswer: PropTypes.shape({
    correct: PropTypes.bool,
    correct_answers: PropTypes.arrayOf(PropTypes.number),
  }),
  creatorAnswers: PropTypes.arrayOf(PropTypes.shape({})),
  sessionAnswers: PropTypes.shape({}),
};

MultipleChoiceQuiz.defaultProps = {
  correctAnswer: {
    correct: false,
    correct_answers: [],
  },
  creatorAnswers: [],
  sessionAnswers: {},
};

export default MultipleChoiceQuiz;
