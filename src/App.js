import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { QuestionWrapper } from './quizzes/MultipleChoice';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="questionWrapper">
        <div className="questionPanel">
          <QuestionWrapper />
          <QuestionWrapper />
          <QuestionWrapper />
        </div>
        <div className="submitPanel">
          <Button>SUBMIT</Button>
        </div>
      </div>
    );
  }
}

export default App;
