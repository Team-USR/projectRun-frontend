import React, { Component } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { MultipleChoiceQuiz } from '../../quizzes/MultipleChoice';
import { MatchQuiz } from '../../quizzes/Match/';
import { MixQuiz } from '../../quizzes/Mix/';

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
      resultsState: false,
      answers: { questions: [] },
      getResponse: '',
      data: {},
    };
    this.isReviewMode = this.isReviewMode.bind(this);
    this.isResultsMode = this.isResultsMode.bind(this);
  }
  componentWillMount() {
    axios.defaults.headers.common.Authorization = this.props.userToken;
    const quizID = 90;
    axios.get(`https://project-run.herokuapp.com/quizzes/${quizID}`)
    .then(response => this.setState({ quizInfo: response.data, loadingQuiz: false }));
  }
  isReviewMode() {
    const newState = !this.state.reviewState;
    this.setState({ reviewState: newState });
  }
  isResultsMode() {
    const quizID = 90;
    console.log(this.state.answers);
    axios.post(`https://project-run.herokuapp.com/quizzes/${quizID}/check`, this.state.answers)
    .then((response) => {
      const newState = !this.state.resultsState;
      const dataSet = response.data;
      const newData = {};
      dataSet.map((object) => {
        newData[object.id] = object;
        return 0;
      });
      this.setState({ resultsState: newState, getResponse: response, data: newData });
      console.log(dataSet);
    });
  }
  collectAnswers(id, answers, type, index) {
    console.log(index);
    const tempAnswers = this.state.answers;
    const tempQuestions = this.state.answers.questions.slice();
    let newAnswer = {};

    if (type === 'multiple_choice') {
      const mcqAnswer = { id, answer_ids: answers };
      newAnswer = mcqAnswer;
    }
    if (type === 'match') {
      const matchAnswer = { id, pairs: answers };
      newAnswer = matchAnswer;
    }
    // if (type === 'mix_quiz') {
    //   const mixQuizAnswer = { id, pairs: answers };
    //   newAnswer = mixQuizAnswer;
    // }
    tempQuestions[index] = newAnswer;
    tempAnswers.questions = tempQuestions;
    this.setState({ answers: tempAnswers });
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
    console.log(this.state.data[question.id]);
    if (question.type === 'multiple_choice') {
      return (
        <MultipleChoiceQuiz
          id={question.id}
          reviewState={this.state.reviewState}
          resultsState={this.state.resultsState}
          question={question}
          index={index}
          correctAnswer={this.state.data[question.id]}
          callbackParent={(questionId, answers) =>
          this.collectAnswers(questionId, answers, question.type, index)}
          key={`multiple_choice_quiz_${question.id}`}
        />
      );
    }
    if (question.type === 'match') {
      return (
        <MatchQuiz
          id={question.id}
          reviewState={this.state.reviewState}
          resultsState={this.state.resultsState}
          question={question}
          index={index}
          correctAnswer={this.state.data[question.id]}
          callbackParent={(questionId, answers) =>
          this.collectAnswers(questionId, answers, question.type, index)}
          key={`match_quiz_${question.id}`}
        />
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
      return (<div className="mainQuizViewerBlock" style={styles.loading}>
        <h1>Loading...</h1>
      </div>);
    }
    return (
      <div className="mainQuizViewerBlock">
        <h1 style={styles.quizTitle}>{this.state.quizInfo.title}</h1>
        {this.state.quizInfo.questions.map((question, index) =>
        this.renderQuestions(question, index))}
        {this.renderSubmitPanel()}
      </div>
    );
  }
}

QuizViewerMainPage.propTypes = {
  userToken: React.PropTypes.string.isRequired,
};
