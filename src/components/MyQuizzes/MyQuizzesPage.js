import React, { PropTypes, Component } from 'react';
import { QuizCreatorMainPage, QuizCreatorReviewer } from './../../quizManager/quizzesCreatorPage';
import { SideBarWrapper } from '../SideBar/index';

export default class MyQuizzesPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentQuiz: false,
      generateQuiz: false,
    };
  }

  updateCurrentQuiz(quizViewer, quizGenerator) {
    this.setState({ currentQuiz: quizViewer, generateQuiz: quizGenerator });
  }

  renderQuizContent() {
    let element = <h1><b> My Quizzes</b></h1>;
    if (this.state.currentQuiz) {
      element = <QuizCreatorReviewer userToken={this.props.userToken} />;
    }
    if (this.state.generateQuiz) {
      element = <QuizCreatorMainPage userToken={this.props.userToken} />;
    }
    return element;
  }

  render() {
    return (
      <div className="myQuizzesPageWrapper">
        <SideBarWrapper
          onSideBarItemClick={(review, create) => this.updateCurrentQuiz(review, create)}
          title={'My Quizzes'}
          type={'SideBarQuizzes'}
        />
        <div className="contentWrapper">
          {this.renderQuizContent()}
        </div>
      </div>
    );
  }
}

MyQuizzesPage.propTypes = {
  userToken: PropTypes.shape({}),
};
