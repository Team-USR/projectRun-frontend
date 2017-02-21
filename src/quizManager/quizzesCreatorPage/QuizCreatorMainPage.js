import React, { Component } from 'react';
import { MultipleChoiceQuizGenerator } from '../../createQuizzes/MultipleChoice';
import { ButtonWrapper } from './index';

let id = 0;
export default class QuizCreatorMainPage extends Component {
  constructor() {
    super();
    this.state = { questions: [{ id: 0, question: '', buttonGroup: '' }] };
  }
  arangeIds() {
    this.state.questions.map((questions, index) => {
      if (questions.id !== index) this.setState({ id: index });
      id = index;
      return index;
    });
  }
  removeQuiz(index) {
    const remQuestions = this.state.questions.filter((question) => {
      if (question.id !== index) return question;
    });
    this.setState({ questions: remQuestions });
  }
  addQuiz(quizType) {
    if (quizType === 'multiple_choice') {
      const questionList = this.state.questions;
      const question = (<MultipleChoiceQuizGenerator index={id} key={id + 100} />);
      const buttonGroup = (
        <ButtonWrapper
          index={id}
          key={id}
          addQuiz={quizTypes => this.addQuiz(quizTypes)}
          removeQuiz={index => this.removeQuiz(index)}
        />);
      const questionObject = { id, question, buttonGroup };
      questionList.push(questionObject);
      this.setState({ questions: questionList });
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
    return (
      <div>
        {this.state.questions[index].question}
        {this.state.questions[index].buttonGroup}
      </div>
    );
  }
  render() {
      console.log("length" + this.state.questions.length)
    return (
      <div>
        <h1> Quiz creator </h1>
        <ButtonWrapper
          key={0}
          index={-1}
          addQuiz={quizType => this.addQuiz(quizType)}
          removeQuiz={index => this.removeQuiz(index)}
        />
        {this.renderQuestions()}
      </div>
    );
  }
}
