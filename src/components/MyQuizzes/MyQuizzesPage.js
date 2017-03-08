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

  componentWillMount() {
    const getSideBar = {
      quizzes: [{ id: 1, title: 'Quiz REVIEWER' }],
    };
    this.setState({ sideBarContent: getSideBar });
  }

  updateCurrentQuiz(quizViewer, quizGenerator) {
    this.setState({ currentQuiz: quizViewer, generateQuiz: quizGenerator });
  }

  handleSideBarTitleClick() {
    this.todo = 'TO DO';
    // this.setState({ panelType: 'my_classes_default_panel' });
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
          onSideBarTitleClick={() => this.handleSideBarTitleClick()}
          sideBarContent={this.state.sideBarContent}
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
  userToken: PropTypes.shape({}).isRequired,
};
