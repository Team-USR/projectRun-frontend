import React, { PropTypes, Component } from 'react';
import { QuizCreatorMainPage, QuizCreatorReviewer, QuizEditorMainPage } from './../../quizManager/quizzesCreatorPage';
import { SideBarWrapper } from '../SideBar/index';

export default class MyQuizzesPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentQuiz: false,
      generateQuiz: false,
      editQuiz: false,
    };
  }

  updateCurrentQuiz(quizViewer, quizGenerator, quizEditor) {
    this.setState({ currentQuiz: quizViewer, generateQuiz: quizGenerator, editQuiz: quizEditor });
  }

  renderQuizContent() {
    let element = <h1><b> My Quizzes</b></h1>;
    if (this.state.currentQuiz) {
      element = (<QuizCreatorReviewer
        userToken={this.props.userToken}
        quizID={134}
        handleSubmitButton={(review, create, edit) => this.updateCurrentQuiz(review, create, edit)}
      />);
    }
    if (this.state.editQuiz) {
      element = (<QuizEditorMainPage
        quizID={134}
        userToken={this.props.userToken}
        handleSubmitButton={(review, create, edit) => this.updateCurrentQuiz(review, create, edit)}
      />);
    }
    if (this.state.generateQuiz) {
      element = (<QuizCreatorMainPage
        userToken={this.props.userToken}
        handleSubmitButton={(review, create, edit) => this.updateCurrentQuiz(review, create, edit)}
      />);
    }
    return element;
  }

  render() {
    return (
      <div className="myQuizzesPageWrapper">
        <SideBarWrapper
          onSideBarItemClick={(review, create) => this.updateCurrentQuiz(review, create, false)}
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
  userToken: PropTypes.string.isRequired,
};
