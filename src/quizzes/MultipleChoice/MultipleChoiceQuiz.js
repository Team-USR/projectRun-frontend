import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { QuestionWrapper } from './index';
import '../../style/MultipleChoice.css';

class MultipleChoiceQuiz extends Component {
  constructor() {
    super();
    //TEST
    this.state = { quizInfo: [
        { question: 'First question?',
          id: '465234',
          choice: [{ choiceText: 'choice1', id: '465234#1' },
                   { choiceText: 'choice2', id: '465234#2' },
                   { choiceText: 'choice3', id: '465234#3' }]
                 },
        { question: 'First question?',
         id: '245324',
         choice: [{ choiceText: 'choice1', id: '245324#1' },
                  { choiceText: 'choice2', id: '245324#2' },
                  { choiceText: 'choice3', id: '245324#3' },
                  { choiceText: 'choice4', id: '245324#4' }]
              }
      ],
       answers: [],
       reviewState: false,
       resultsState: false,
       //Test answer state
       correctAnswers: [
         { questionId: '465234',
           correctChoice: [{ correct: true, choiceFeedback: 'Because yes', id: '465234#1' },
                           { correct: false, choiceFeedback: 'Because no', id: '465234#2' },
                           { correct: false, choiceFeedback: 'Because no', id: '465234#3' }] },
        { questionId: '245324',
          correctChoice: [{ correct: false, choiceFeedback: 'Because no', id: '245324#1' },
                          { correct: true, choiceFeedback: 'Because yes', id: '245324#2' },
                          { correct: true, choiceFeedback: 'Because yes', id: '245324#2' },
                          { correct: false, choiceFeedback: 'Because no', id: '245324#3' }] }

                                                        ] };

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
findCorrectChoice(id) {
  let answer = null;
  this.state.correctAnswers.map((question) => {
        if (question.questionId === id) {
          answer = question.correctChoice;
        }
        });
        return answer;
}
renderQuestions(objectQuestion, index) {
  return (
    <QuestionWrapper
     objectQuestion={objectQuestion}
     index={index}
     key={index}
     id={objectQuestion.id}
     inReview={this.state.reviewState}
     inResultsState={this.state.resultsState}
     myAnswers={this.state.answers}
     correctAnswers={this.findCorrectChoice(objectQuestion.id)}
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
    return (
      <div className="questionsBlock">
      {this.state.quizInfo.map(
        (objectQuestion, index) => this.renderQuestions(objectQuestion, index))}
      {this.renderSubmitPanel()}
      </div>
    );
  }
}

export { MultipleChoiceQuiz };
