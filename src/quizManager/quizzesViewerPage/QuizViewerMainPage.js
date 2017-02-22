import React, { Component } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { MultipleChoiceQuiz } from '../../quizzes/MultipleChoice';
import { MatchQuiz } from '../../quizzes/Match/';
import { MixQuiz } from '../../quizzes/Mix/';
import '../../App.css';

const styles = {
  quizTitle: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
  },
  loading: {
    textAlign: 'center',
    marginTop: 100,
  },
};

export default class QuizViewerMainPage extends Component {
  constructor() {
    super();
    this.state = { loadingQuiz: true,
      quizInfo: [],
      reviewState: false,
      resultsState: false };
    this.isReviewMode = this.isReviewMode.bind(this);
    this.isResultsMode = this.isResultsMode.bind(this);
  }
  componentWillMount() {
    axios.get('https://project-run.herokuapp.com/quizzes/13')
    .then(response => this.setState({ quizInfo: response.data, loadingQuiz: false }));
  }
  isReviewMode() {
    const newState = !this.state.reviewState;
    this.setState({ reviewState: newState });
  }
  isResultsMode() {
    const newState = !this.state.resultsState;
    this.setState({ resultsState: newState });
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
    return ('');
  }
  renderQuestions(question, index) {
    if (question.type === 'multiple_choice') {
      return (
        <MultipleChoiceQuiz
          reviewState={this.state.reviewState}
          resultsState={this.state.resultsState}
          question={question}
          index={index}
          key={question.id}
        />
      );
    }
    if (question.type === 'match') {
      return (
        <MatchQuiz />
      );
    }
    if (question.type === 'mix') {
      return (
        <MixQuiz
          question={question}
          index={index}
          key={question.id}
          reviewState={this.state.reviewState}
          resultsState={this.state.resultsState}
        />
      );
    }
    return ('');
  }
  render() {
    if (this.state.loadingQuiz) {
      return (<div className="questionBlock" style={styles.loading}>
        <h1>Loading...</h1>
      </div>);
    }
    return (
      <div className="questionBlock">
        <h1 style={styles.quizTitle}>{this.state.quizInfo.title}</h1>
        {this.state.quizInfo.questions.map((question, index) =>
          this.renderQuestions(question, index))}
          {this.renderSubmitPanel()}
      </div>
    );
  }
}
