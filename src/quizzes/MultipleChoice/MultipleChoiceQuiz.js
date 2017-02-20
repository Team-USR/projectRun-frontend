import React, { Component } from 'react';
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
      reviewState: false,
      resultsState: false,
      correctAnswers: [],
    };
       this.isReviewMode = this.isReviewMode.bind(this);
       this.isResultsMode = this.isResultsMode.bind(this);
}
onChildChanged(newState, index) {
  const newArray = this.state.answers.slice();
  newArray[index] = newState;
  this.setState({ answers: newArray });
}
isReviewMode() {
  const newState = !this.state.reviewState;
  this.setState({ reviewState: newState });
}
isResultsMode() {
  const newState = !this.state.resultsState;
  this.setState({ resultsState: newState });
}
renderQuestion(question, index) {
  return (
    <QuestionWrapper
     question={question}
     index={index}
     key={index}
     inReview={this.state.reviewState}
     inResultsState={this.state.resultsState}
     myAnswers={this.state.answers}
     callbackParent={(newState) => this.onChildChanged(newState, index)}
    />
  );
}

renderSubmitPanel() {
      if (this.state.reviewState && !this.state.resultsState) {
        return (
        <div className="submitPanel">
          <Button className="submitButton" onClick={this.isReviewMode}>BACK</Button>
          <Button className="submitButton" onClick={this.isResultsMode}>SUBMIT</Button>
        </div>);
      }
      if (!this.state.reviewState && !this.state.resultsState) {
        return (
        <div className="submitPanel">
          <Button className="submitButton" onClick={this.isReviewMode}> FINISH</Button>
        </div>);
      } if (this.state.resultsState) {
        return (
          <div className="submitPanel" />
          );
      }
}

  render() {
    const { index, question } = this.props;
    return (
      <div className="questionBlock">
      {this.renderQuestion(question, index)}
      {this.renderSubmitPanel()}
       </div>
);
}
}


export  { MultipleChoiceQuiz } ;
