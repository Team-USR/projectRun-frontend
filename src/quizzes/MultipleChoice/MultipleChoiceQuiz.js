import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
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
  onChildChanged(newState, index) {
    const newArray = this.state.answers.slice();
    newArray[index] = newState;
    this.setState({ answers: newArray });
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

};

export default MultipleChoiceQuiz;
