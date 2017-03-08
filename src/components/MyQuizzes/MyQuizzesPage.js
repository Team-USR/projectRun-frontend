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

  componentWillMount() {
    const getSideBar = {
      quizzes: [{ id: 1, title: 'Quiz REVIEWER' }],
    };
    this.setState({ sideBarContent: getSideBar });
  }
  updateCurrentQuiz(quizViewer, quizGenerator, quizEditor) {
    this.setState({ currentQuiz: quizViewer, generateQuiz: quizGenerator, editQuiz: quizEditor });
  }
  handleSideBarTitleClick() {
    this.todo = 'TO DO';
    // this.setState({ panelType: 'my_classes_default_panel' });
  }
  renderQuizContent() {
    let element = <h1><b> My Quizzes</b></h1>;
    if (this.state.currentQuiz) {
      element = (<QuizCreatorReviewer
        userToken={this.props.userToken}
        quizID={5}
        handleSubmitButton={(review, create, edit) => this.updateCurrentQuiz(review, create, edit)}
      />);
    }
    if (this.state.editQuiz) {
      element = (<QuizEditorMainPage
        quizID={5}
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
          onSideBarTitleClick={() => this.handleSideBarTitleClick()}
          sideBarContent={this.state.sideBarContent}
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
  userToken: PropTypes.shape({}).isRequired,
};
