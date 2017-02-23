import React from 'react';
// import { QuizViewerMainPage } from './quizManager/quizzesViewerPage/';
// import { QuizCreatorMainPage } from './quizManager/quizzesCreatorPage';
import { CrossQuiz } from './quizzes/Cross/index';
import './App.css';

export default function App() {
  return (
    <CrossQuiz
      reviewState={false}
      resultsState={false}
      question={{
        id: 10,
        question: 'Cross Quiz',
        type: 'cross',
      }}
      index={1}
      callbackParent={(questionId, answers) =>
      this.collectAnswers(questionId, answers, 'cross', 1)}
      key={10}
    />
  );
}
