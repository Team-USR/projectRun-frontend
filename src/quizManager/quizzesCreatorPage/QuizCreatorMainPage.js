import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { MultipleChoiceQuizGenerator } from '../../createQuizzes/MultipleChoice';
import { MatchQuizGenerator } from '../../createQuizzes/Match';
import { ButtonWrapper } from './index';
import '../../style/Main.css';

let id = 0;
let displayIndex = 0;
export default class QuizCreatorMainPage extends Component {
  constructor() {
    super();
    this.state = {
      questions: [{ id: 0, question: '', buttonGroup: '' }],
      inputQuestions: [{ id: 0, question: '', answers: [] }],
      answers: { quiz: [] },
      reviewState: false,
      resultsState: false,
    };
    this.isReviewMode = this.isReviewMode.bind(this);
    this.isResultsMode = this.isResultsMode.bind(this);
  }
  removeQuiz(index) {
    displayIndex = 0;
    const remQuestions = this.state.questions;
    remQuestions[index + 1].question = null;
    this.setState({ questions: remQuestions });
  }
  handleInput(questionI, answers, i) {
    if (answers) {
      const inputQuestion = this.state.inputQuestions;
      inputQuestion[i].answers = answers;
      this.setState({ inputQuestions: inputQuestion });
    }
  }

  isReviewMode() {
    const newState = !this.state.reviewState;
    this.setState({ reviewState: newState });
  }

  isResultsMode() {
    const newState = !this.state.resultsState;
    this.setState({ resultsState: newState });
  }

  addQuiz(quizType) {
    let cont;
    displayIndex = 0;

    const buttonGroup = (
      <div className="">
        <ButtonWrapper
          index={id}
          key={id}
          removeQuiz={index => this.removeQuiz(index)}
        />
      </div>);

    let questionObject = { id };
    const questionList = this.state.questions;
    const inputQuestionList = this.state.inputQuestions;
    const ques = '';
    const answ = '';
    const inputQuestion = { id, ques, answ };

    if (this.state.inputQuestions[id].answers) {
      cont = this.state.inputQuestions[id].answers;
    }
    if (quizType === 'multiple_choice') {
      const question = (
        <MultipleChoiceQuizGenerator
          handleInput={(questionI, answers) => this.handleInput(questionI, answers, id)}
          content={cont}
          index={id}
          key={id + 100}
        />);
      questionObject = { id, question, buttonGroup };
    }

    if (quizType === 'match') {
      const question = (
        <MatchQuizGenerator
          reviewState={this.state.reviewState}
          resultsState={this.state.resultsState}
          index={id}
          key={id + 100}
        />);
      questionObject = { id, question, buttonGroup };
    }

    inputQuestionList.push(inputQuestion);
    questionList.push(questionObject);
    this.setState({ questions: questionList, inputQuestions: inputQuestionList });
    id += 1;
  }
  renderQuestions() {
    return (
      this.state.questions.map((object, index) =>
         this.renderGroup(object, index))
    );
  }
  renderGroup(object, index) {
    if (this.state.questions[index].question) {
      displayIndex += 1;
      return (
        <div className="generatorQuizContainer">
          <h2>{displayIndex}</h2>
          {this.state.questions[index].question}
          {this.state.questions[index].buttonGroup}
        </div>
      );
    }
    return ('');
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

  render() {
    return (
      <div className="mainQuizGeneratorBlock">
        <h1> Quiz creator </h1>
        <Button onClick={() => this.addQuiz('multiple_choice')}> Multiple Choice</Button>
        <Button onClick={() => this.addQuiz('match')}>Match</Button>
        {this.renderQuestions()}

        <br /><br /><br />
        { /* Display Buttons section */ }
        { this.renderSubmitPanel() }
      </div>
    );
  }
}
