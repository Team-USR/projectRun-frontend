import React, { PropTypes, Component } from 'react';
import cookie from 'react-cookie';
import axios from 'axios';
import { QuizCreatorMainPage, QuizCreatorReviewer, QuizEditorMainPage } from './../../quizManager/quizzesCreatorPage';
import { QuizViewerMainPage, QuizSessionViewer } from './../../quizManager/quizzesViewerPage';
import { SideBarWrapper } from '../SideBar/index';
import { API_URL, STUDENT, TEACHER } from '../../constants';
import { BrandSpinner } from '../utils';
import { DefaultQuizzesPanel } from './panels';
import { getLastHighestGrades } from '../../helpers';

export default class MyQuizzesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      panelType: 'default',
      currentID: -1,
      sideBarContent: {},
      loadingSideBar: true,
      contentLoading: true,
      submittedQuizzes: [],
      userT: STUDENT,
    };
  }
  componentWillMount() {
    const settingUserType = cookie.load('userType');
    if (settingUserType) {
      this.setState({ userT: settingUserType });
      if (settingUserType === TEACHER) {
        this.requestTeacherData();
      }
      if (settingUserType === STUDENT) {
        this.requestStudentData();
      }
    } else this.requestStudentData();
  }
  requestStudentData() {
    axios({
      url: `${API_URL}/users/mine/quizzes`,
      headers: this.props.userToken,
    })
    .then((response) => {
      if (!response || (response && response.status !== 200)) {
        this.setState({ errorState: true });
      }
//      console.log(response.data);
      const newSideBarContent = { session: response.data };
  //  console.log("My quizzes", response.data);
  //  this.setState({ sideBarContent: newSideBarContent, loadingSideBar: false });
      setTimeout(() => {
        this.setState({
          sideBarContent: newSideBarContent,
          loadingSideBar: false,
        });
      }, 1200);
      let pType = 'default';
      let quizID = -1;
      if (cookie.load('current-session-type') != null && cookie.load('current-session-id') != null) {
        pType = cookie.load('current-session-type');
        quizID = cookie.load('current-session-id');
        this.setState({ panelType: pType, currentID: quizID });
      }
    })
    .catch(() => {
      const newSideBarContent = { session: [] };
      this.setState({ sideBarContent: newSideBarContent, loadingSideBar: false });
      this.updateCurrentQuiz('default');
    });
    axios({
      url: `${API_URL}/users/mine/submitted`,
      headers: this.props.userToken,
    })
    .then((res) => {
      const highestGradeSessions = getLastHighestGrades(res.data);
      this.setState({ submittedQuizzes: highestGradeSessions });
    });
  }
  requestTeacherData() {
    axios({
      url: `${API_URL}/quizzes/mine`,
      headers: this.props.userToken,
    })
    .then((response) => {
      if (!response || (response && response.status !== 200)) {
        this.setState({ errorState: true });
      }
      const newSideBarContent = { quizzes: response.data };
      setTimeout(() => {
        this.setState({
          sideBarContent: newSideBarContent,
          loadingSideBar: false,
        });
      }, 1200);
      let pType = 'default';
      let quizID = -1;
      if (cookie.load('current-session-type') != null && cookie.load('current-session-id') != null) {
        pType = cookie.load('current-session-type');
        quizID = cookie.load('current-session-id');
        this.setState({ panelType: pType, currentID: quizID });
      }
    })
    .catch(() => {
      this.setState({ panelType: 'default' });
    });
  }
  reloadBar() {
    const settingUserType = cookie.load('userType');
    if (settingUserType) {
      this.setState({ userT: settingUserType });
      if (settingUserType === TEACHER) { // CHANGE TO TEACHER
        this.requestTeacherData();
      }
      if (settingUserType === STUDENT) {
        this.requestStudentData();
      }
    } else this.requestStudentData();
  }
  updateCurrentQuiz(panelT) {
  //  console.log(panelT);
    this.setState({ panelType: panelT });
    cookie.save('current-session-type', panelT);
  }
  deleteThisQUiz(id) {
    axios({
      url: `${API_URL}/quizzes/${id}`,
      method: 'delete',
      headers: this.props.userToken,
    })
    .then((response) => {
      if (!response || (response && response.status !== 200)) {
        this.setState({ errorState: true });
      }
  //    console.log('deleted');
      cookie.remove('current-session-id');
      cookie.remove('current-session-type');
      this.updateCurrentQuiz('default');
      this.reloadBar();
    //  this.setState({ loadingSideBar: false });
    });
  }
  saveCurrentQuiz(id) {
    this.id = id;
    this.setState({ currentID: id.toString() });
    cookie.save('current-session-id', id);
  }
  handleSideBarTitleClick() {
    this.updateCurrentQuiz('default');
  }
  renderQuizContent() {
//    console.log("rendering",this.state.currentID);
    let element = <h1><b> My Quizzes</b></h1>;
    if (this.state.panelType === 'default') {
      element = (<DefaultQuizzesPanel
        userT={this.state.userT}
        quizzes={this.state.userT === STUDENT ?
          this.state.sideBarContent.session : this.state.sideBarContent.quizzes}
        submittedQuizzes={this.state.submittedQuizzes}
      />);
    }
    if (this.state.userT === TEACHER) {
      if (this.state.panelType === 'reviewer') {
        element = (<QuizCreatorReviewer
          quizID={this.state.currentID}
          userToken={this.props.userToken}
          handlePublish={() => this.reloadBar()}
          handleSubmitButton={() => { this.reloadBar(); this.updateCurrentQuiz('editor'); }}
          deleteQuiz={(deletedID) => { this.reloadBar(); this.deleteThisQUiz(deletedID); }}
          handleError={type => this.updateCurrentQuiz(type)}
        />);
      }
      if (this.state.panelType === 'editor') {
        element = (<QuizEditorMainPage
          quizID={this.state.currentID}
          userToken={this.props.userToken}
          handleSubmitButton={() => { this.reloadBar(); this.updateCurrentQuiz('reviewer'); }}
          handleError={type => this.updateCurrentQuiz(type)}
        />);
      }
      if (this.state.panelType === 'creator') {
        element = (<QuizCreatorMainPage
          userToken={this.props.userToken}
          handlePublish={(id) => { this.reloadBar(); this.saveCurrentQuiz(id); }}
          handleSubmitButton={() => this.updateCurrentQuiz('reviewer')}
          handleError={type => this.updateCurrentQuiz(type)}
        />);
      }
    }
    if (this.state.userT === STUDENT) {
      if (this.state.panelType === 'sessions') {
        element = (<QuizSessionViewer
          userToken={this.props.userToken}
          quizID={this.state.currentID}
          handleStartButton={() => { this.reloadBar(); this.updateCurrentQuiz('viewer'); }}
        />);
      }
      if (this.state.panelType === 'viewer') {
        element = (<QuizViewerMainPage
          userToken={this.props.userToken}
          quizID={this.state.currentID} // this.state.currentID
          handleSubmitButton={() => { this.reloadBar(); this.updateCurrentQuiz('viewer'); }}
          reloadSideBar={() => this.reloadBar()}
          handleError={type => this.updateCurrentQuiz(type)}
        />);
      }
    }
    return element;
  }

  render() {
    if (this.state.loadingSideBar === true) {
      return (<BrandSpinner />);
    }
    return (
      <div className="myQuizzesPageWrapper">
        <SideBarWrapper
          onSideBarItemClick={(id, panelType) => {
            this.updateCurrentQuiz(panelType);
            this.saveCurrentQuiz(id);
          }}
          createQuiz={() => this.updateCurrentQuiz('creator')}
          onSideBarTitleClick={() => this.handleSideBarTitleClick()}
          sideBarContent={this.state.sideBarContent}
          title={'My Quizzes'}
          type={'SideBarQuizzes'}
          userType={this.state.userT}
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
