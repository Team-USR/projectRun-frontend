import React from 'react';
// import { QuizViewerMainPage } from './quizManager/quizzesViewerPage';
//  import { QuizCreatorMainPage } from './quizManager/quizzesCreatorPage';
import { HomePage } from './components/UserAccount/';
import { NavBarContainer } from './containers';
import './App.css';
import './style/Main.css';

export default function App() {
  return (
    <div className="appWrapper">
      <NavBarContainer />
      <HomePage />
    </div>
  );
}
