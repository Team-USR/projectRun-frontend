import React, { Component } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { QuestionWrapper } from './index';
import '../../style/MultipleChoice.css';

class MultipleChoiceQuiz extends Component {
  constructor() {
    super();
    this.state = { quizInfo: [],
      loading: true,
       answers: [],
       reviewState: false,
       resultsState: false,
       //Test answer state
       correctAnswers: [
         { questionId: 7,
           correctChoice: [{ correct: true, choiceFeedback: 'Because yes', id: '465234#1' },
                           { correct: false, choiceFeedback: 'Because no', id: '465234#2' }] },
        { questionId: 8,
          correctChoice: [{ correct: false, choiceFeedback: 'Because no', id: '245324#1' },
                          { correct: true, choiceFeedback: 'Because yes', id: '245324#2' }] }

        ] };
       this.isReviewMode = this.isReviewMode.bind(this);
       this.isResultsMode = this.isResultsMode.bind(this);
}
componentWillMount() {
    const { quizId } = this.props;
    axios.get('https://project-run.herokuapp.com/quizzes/' + quizId)
      .then(response => this.setState({ quizInfo: response.data, loading: false }));
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
     //On finish press make the request to get the results then pass the results to the
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
    if (this.state.loading) {
      return (
        <div className="questionBlock" style={styles.loading}>
        <h1>Loading...</h1>
        </div>
      );
    }
    return (
      <div className="questionBlock">
      {this.state.quizInfo.questions.map(
      (objectQuestion, index) => this.renderQuestions(objectQuestion, index))}
      {this.renderSubmitPanel()}
       </div>
);
}
}
const styles = {
  loading: {
    textAlign: 'center',
    marginTop: 100,
  }
};

export { MultipleChoiceQuiz };
