import React, { Component } from 'react';
import { QuizViewerMainPage } from './../../quizManager/quizzesViewerPage/index';
import { SideBarWrapper } from '../SideBar/index';

export default class MyQuizzesPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentQuiz: '',
    };
  }

  updateCurrentQuiz(newState) {
    this.setState({ currentQuiz: newState });
  }

  renderQuizViewer() {
    let element = <h1><b> My Quizzes</b></h1>;
    if (this.state.currentQuiz !== '') {
      element = <QuizViewerMainPage />;
    }
    return element;
  }

  render() {
    return (
      <div className="myQuizzesPageWrapper">
        <SideBarWrapper
          onSideBarItemClick={quiz => this.updateCurrentQuiz(quiz)}
          title={'My Quizzes'}
          type={'SideBarQuizzes'}
        />
        <div className="contentWrapper">
          {this.renderQuizViewer()}
        </div>
      </div>
    );
  }
}
