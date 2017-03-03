import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { MultipleChoiceQuizGenerator } from '../../createQuizzes/MultipleChoice';
import { MatchQuizGenerator } from '../../createQuizzes/Match';
import { ButtonWrapper, QuizCreatorReviewer } from './index';

import '../../style/Main.css';

const styles = {
  loading: {
    textAlign: 'center',
    marginTop: 100,
  },
};
let id = 0;
let displayIndex = 0;
export default class QuizCreatorMainPage extends Component {
  constructor() {
    super();
    this.state = {
      questions: [],
      inputQuestions: [{
      }],
      submitedQuestions: { quiz: { title: '', questions_attributes: [] } },
      generatedQuizID: 0,
      answers: { quiz: [] },
      reviewState: false,
      resultsState: false,
      loading: false,
    };
    this.isReviewMode = this.isReviewMode.bind(this);
    this.isResultsMode = this.isResultsMode.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
  }
  removeQuiz(index) {
    displayIndex = 0;
    const remQuestions = this.state.questions;
    remQuestions[index] = null;
    const sQuestions = this.state.submitedQuestions;
    sQuestions.quiz.questions_attributes[index] = null;
    this.setState({ questions: remQuestions, submitedQuestions: sQuestions });
  }
  handleInput(questionI, answers, i) {
    if (answers) {
      const inputQuestion = this.state.inputQuestions;
      inputQuestion[i].answers = answers;
      this.setState({ inputQuestions: inputQuestion });
    }
  }
  isReviewMode() {
    const sQuestions = this.state.submitedQuestions;
//    console.log("submitedQuestions ", sQuestions,"finishsubmited");
    const filteredQuestions = sQuestions.quiz.questions_attributes.filter(element =>
     element !== null);
    const newState = !this.state.reviewState;
    const loadingTrue = true;
//    console.log("filtered ",filteredQuestions," finishfiltered");
    this.setState({ loading: loadingTrue, submitedQuestions: filteredQuestions });
  //  console.log("----------");
  //  console.log(this.state.submitedQuestions);
//  console.log("----------");
    const auth = 'Authorization';
    axios.defaults.headers.common[auth] = this.props.userToken;
    axios.post('https://project-run.herokuapp.com/quizzes', this.state.submitedQuestions)
    .then((response) => {
      const resultID = response.data.id;
      const loadingFalse = false;
      this.setState({ generatedQuizID: resultID, reviewState: newState, loading: loadingFalse });
    });
  }
  isResultsMode() {
    const newState = !this.state.resultsState;
    this.setState({ resultsState: newState });
  }
  collectObject(answersAttributes, question, type, questionID) {
    const inputQ = this.state.submitedQuestions;
    const quiz = { question, type, answers_attributes: answersAttributes };
    // console.log("questionID"+questionID);
    // if (inputQ.quiz.questions_attributes[questionID] === null) {
    //   inputQ.quiz.questions_attributes.push(quiz);
    // } else {
    inputQ.quiz.questions_attributes[questionID] = quiz;
  //  }
    this.setState({ submitedQuestions: inputQ });
  }
  addQuiz(quizType) {
  //  console.log(id);
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
      console.log(id);
      const question = (
        <MultipleChoiceQuizGenerator
          handleInput={(questionI, answers) => this.handleInput(questionI, answers, id)}
          content={cont}
          index={id}
          key={id + 100}
          updateParent={(answersAttributes, qObject, ind) =>
            this.collectObject(answersAttributes, qObject, 'multiple_choice', ind)}
        />);
      questionObject = { id, question, buttonGroup };
    }

    if (quizType === 'match') {
      const question = (
        <MatchQuizGenerator
          reviewState={this.state.reviewState}
          resultsState={this.state.resultsState}
          index={id}
          key={id + 101}
        />);
      questionObject = { id, question, buttonGroup };
    }

    inputQuestionList.push(inputQuestion);
    questionList.push(questionObject);
    this.setState({ questions: questionList, inputQuestions: inputQuestionList });
    id += 1;
  }
  changeTitle(event) {
    const generatedQuiz = this.state.submitedQuestions;
    generatedQuiz.quiz.title = event.target.value;
    this.setState({ submitedQuestions: generatedQuiz });
  }
  renderQuestions() {
    displayIndex = 0;
    return (
      this.state.questions.map((object, index) =>
         this.renderGroup(object, index))
    );
  }
  renderGroup(object, index) {
    if (this.state.questions[index]) {
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
          <Button className="submitButton" onClick={this.isReviewMode}>EDIT QUIZ</Button>
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
  //  console.log("start rendering");
  //  console.log(this.state.submitedQuestions);
    const submit = this.state.submitedQuestions;
  //  console.log(this.state.questions);
  //  console.log("end rendering");
    if (!this.state.reviewState && this.state.loading === false) {
      return (
        <div className="mainQuizGeneratorBlock">
          <h1> Quiz creator </h1>
          <label htmlFor="titleInput">
          Title:
           <input
             id="titleInput" type="text" placeholder="title" onChange={this.changeTitle}
           />
          </label>
          <br /><br />
         Select a quiz to be added:
         <br />
          <Button onClick={() => this.addQuiz('multiple_choice')}> Multiple Choice</Button>
          <Button onClick={() => this.addQuiz('match')}>Match</Button>
          {this.renderQuestions()}
          <br /><br /><br />
          { this.renderSubmitPanel() }
        </div>
      );
    } else
    if (this.state.reviewState && this.state.loading === false) {
    //  console.log("test quiz reviwer");
    //  console.log(submit);
    //  console.log(submit);
    //  console.log("end quiz reviwer");
      return (
        <div>
          <QuizCreatorReviewer
            quizID={this.state.generatedQuizID}
            token={this.props.userToken}
            questionsWithAnswers={submit}
          />
          <br /><br /><br />
          { this.renderSubmitPanel() }
        </div>
      );
    } else
    if (this.state.loading === true) {
      return (<div className="mainQuizViewerBlock" style={styles.loading}>
        <h1>Saving quiz draft...</h1>
      </div>);
    }
    return ('');
  }
}
QuizCreatorMainPage.propTypes = {
  userToken: PropTypes.string.isRequired,
};
