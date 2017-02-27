import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { MultipleChoiceQuizGenerator } from '../../createQuizzes/MultipleChoice';
import { ButtonWrapper } from './index';


let id = 0;
let displayIndex = 0;
export default class QuizCreatorMainPage extends Component {
  constructor() {
    super();
    this.state = { questions: [{ id: 0, question: '', buttonGroup: '' }], inputQuestions: [{ id: 0, question: '', answers: [] }] };
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
  addQuiz(quizType) {
    let cont;
    displayIndex = 0;
    if (this.state.inputQuestions[id].answers) {
      cont = this.state.inputQuestions[id].answers;
    }
    if (quizType === 'multiple_choice') {
      const questionList = this.state.questions;
      const inputQuestionList = this.state.inputQuestions;
      const question = (
        <MultipleChoiceQuizGenerator
          handleInput={(questionI, answers) => this.handleInput(questionI, answers, id)}
          content={cont}
          index={id}
          key={id + 100}
        />);
      const buttonGroup = (
        <div className="">
          <ButtonWrapper
            index={id}
            key={id}
            addQuiz={quizTypes => this.addQuiz(quizTypes)}
            removeQuiz={index => this.removeQuiz(index)}
          />
        </div>);
      const questionObject = { id, question, buttonGroup };
      const ques = '';
      const answ = '';
      const inputQuestion = { id, ques, answ };
      inputQuestionList.push(inputQuestion);
      questionList.push(questionObject);
      this.setState({ questions: questionList });
      this.setState({ inputQuestions: inputQuestionList });
      id += 1;
    }
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
        <div className="matchQuizContainer">
          <h2>{displayIndex}</h2>
          {this.state.questions[index].question}
          {this.state.questions[index].buttonGroup}
        </div>
      );
    }
    return ('');
  }
  render() {
    return (
      <div>
        <h1> Quiz creator </h1>
        <Button onClick={() => this.addQuiz('multiple_choice')}> Multiple Choice</Button>
        <Button>Match</Button>
        {this.renderQuestions()}
      </div>
    );
  }
}
