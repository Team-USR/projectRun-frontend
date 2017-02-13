import React from 'react';
import MatchQuiz from './quizzes/Match/MatchQuiz';
import CreateMatchQuiz from './createQuizzes/Match/CreateMatchQuiz';
import './App.css';

function App() {
  return (
    <div>
      <CreateMatchQuiz />
      <MatchQuiz />
    </div>
  );
}

export default App;
