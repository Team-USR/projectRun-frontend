import React, { PropTypes, Component } from 'react';
import cookie from 'react-cookie';
import { QuizCreatorMainPage, QuizCreatorReviewer, QuizEditorMainPage } from './../../quizManager/quizzesCreatorPage';
import { SideBarWrapper } from '../SideBar/index';


export default class MyQuizzesPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      panelType: 'my_quizzes_default_panel',
      currentID: -1,
    };
  }

  componentWillMount() {
    let pType = 'default';
    let quizID = -1;
    if (cookie.load('current-session-type') != null) {
      pType = cookie.load('current-session-type');
      this.setState({ panelType: pType });
    }
    if (cookie.load('current-session-id') != null) {
      quizID = cookie.load('current-session-id');
      this.setState({ currentID: quizID });
    }
    const getSideBar = {
      quizzes: [{ id: 3, title: 'Quiz REVIEWER' }],
    };
    this.setState({ sideBarContent: getSideBar });
  }
  updateCurrentQuiz(panelT) {
    this.setState({ panelType: panelT });
  //  console.log(panelT);
    cookie.save('current-session-type', panelT);
  }
  saveCurrentQuiz(id) {
    this.id = id;
    cookie.save('current-session-id', id);
  }
  handleSideBarTitleClick() {
    this.todo = 'TO DO';
    // this.setState({ panelType: 'my_classes_default_panel' });
  }
  renderQuizContent() {
    let element = <h1><b> My Quizzes</b></h1>;
    if (this.state.panelType === 'reviewer') {
      element = (<QuizCreatorReviewer
        quizID={this.state.currentID}
        userToken={this.props.userToken}
        handleSubmitButton={() => this.updateCurrentQuiz('editor')}
      />);
    }
    if (this.state.panelType === 'editor') {
      element = (<QuizEditorMainPage
        quizID={this.state.currentID}
        userToken={this.props.userToken}
        handleSubmitButton={() => this.updateCurrentQuiz('reviewer')}
      />);
    }
    if (this.state.panelType === 'creator') {
      element = (<QuizCreatorMainPage
        userToken={this.props.userToken}
        handleSubmitButton={() => this.updateCurrentQuiz('reviewer')}
      />);
    }
    return element;
  }

  render() {
    return (
      <div className="myQuizzesPageWrapper">
        <SideBarWrapper
          onSideBarItemClick={(id) => {
            this.updateCurrentQuiz('reviewer');
            this.saveCurrentQuiz(id);
          }}
          createQuiz={() => this.updateCurrentQuiz('creator')}
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
