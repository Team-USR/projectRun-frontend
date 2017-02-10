import React, { Component } from 'react';
import { MultipleChoiceQuiz } from './quizzes/MultipleChoice';
import './App.css';

class App extends Component {
  render() {
    return (
      <MultipleChoiceQuiz quizId='4' />
    );
  }
}

export default App;
