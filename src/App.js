import React, { Component } from 'react';
import axios from 'axios';
import { MultipleChoiceQuiz } from './quizzes/MultipleChoice/';
import { QuizGeneratorWrapper } from './createQuizzes/MultipleChoice/';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = { loadingQuiz: true, quizInfo: [] };
  }
  componentWillMount() {
    const quizId = '5';
    axios.get('https://project-run.herokuapp.com/quizzes/' + quizId)
    .then(response => this.setState({ quizInfo: response.data, loadingQuiz: false }));
  }
  renderQuestions(question, index) {
    if (question.type === 'multiple_choice') {
      return (
        <MultipleChoiceQuiz
        question={question}
        index={index}
        key={question.id}
        />);
    }
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
          {this.state.quizInfo.questions.map((question, index) => this.renderQuestions(question, index))}
      </div>
    );
  //  return (<QuizGeneratorWrapper />);
  }

}
const styles = {
  quizTitle: {
    fontSize: 20,
    color:'#000',
    textAlign: 'center',
  },
  loading: {
    textAlign: 'center',
    marginTop: 100,
  }
};

export default App;
