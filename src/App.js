import React from 'react';
// import { QuizViewerMainPage } from './quizManager/quizzesViewerPage';
//  import { QuizCreatorMainPage } from './quizManager/quizzesCreatorPage';
import { NavBar, HomePage } from './components/UserAccount/';
import './App.css';
import './style/Main.css';

export default function App() {
  return (
    <div className="appWrapper">
      <NavBar />
      <HomePage />
    </div>
  );
}
