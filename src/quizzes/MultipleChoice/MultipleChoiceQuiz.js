import React, { Component, PropTypes } from 'react';
import { QuestionWrapper } from './index';
import '../../style/MultipleChoice.css';

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
  index: PropTypes.number.isRequired,
  reviewState: PropTypes.bool.isRequired,
  resultsState: PropTypes.bool.isRequired,
  callbackParent: PropTypes.func.isRequired,
  question: PropTypes.shape({
    id: PropTypes.number.isRequired,
    question: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    answers: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      answer: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
};

export default MultipleChoiceQuiz;
