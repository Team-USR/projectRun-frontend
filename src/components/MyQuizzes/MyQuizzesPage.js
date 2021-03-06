import React, { PropTypes, Component } from 'react';
import cookie from 'react-cookie';
import axios from 'axios';
import { QuizCreatorMainPage, QuizCreatorReviewer, QuizEditorMainPage } from './../../quizManager/quizzesCreatorPage';
import { QuizViewerMainPage, QuizSessionViewer } from './../../quizManager/quizzesViewerPage';
import { SideBarWrapper } from '../SideBar/index';
import { API_URL, STUDENT, TEACHER } from '../../constants';
import { BrandSpinner, ModalError } from '../utils';
import { DefaultQuizzesPanel } from './panels';
import { getLastHighestGrades } from '../../helpers';

/*
   Component that manages the content from the My Quizzes page.
*/
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
      showModal: false,
      modalContent: {
        header: 'Error!',
        body: 'The Quiz contains errors',
        buttons: ['close'],
        modalProps: {},
      },
    };
  }
  /*
    Calls specific methods to request the data according to the user type ( Student or Teacher )
    in order to populate the sidebar with the personal quizzes ( for teacher : quizzes created,
  for student: quizzes assigned to )
  */
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
  /*
    Requests the data to populate the sidebar for the student mode.
  */
  requestStudentData() {
    axios({
      url: `${API_URL}/users/mine/quizzes`,
      headers: this.props.userToken,
    })
    .then((response) => {
      if (!response || (response && response.status !== 200)) {
        this.setState({ errorState: true });
      }
      const newSideBarContent = { session: response.data };
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
  /*
    Requests the data to populate the teacher sidebar and the main content.
  */
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
  /*
    Calls methods according to the user type in order to make new requests
    so the sidebar can be updated when the user makes a certain action.
  */
  reloadBar() {
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
  /*
    Method that saves the current quiz in the cookie
    so it can be displayed directly in case the user refreshes the page.
  */
  updateCurrentQuiz(panelT) {
    this.setState({ panelType: panelT });
    cookie.save('current-session-type', panelT);
  }
  /*
  Closes the modal panel
  */
  closeModal() {
    this.setState({ showModal: false });
  }
  /*
  Opens the modal panel
  */
  openModal(content) {
    if (content) {
      this.setState({ showModal: true, modalContent: content });
    } else {
      this.setState({ showModal: true });
    }
  }
  /*
   Confirm the delete of a quiz when pressing on the modal button
  */
  confirmDeleteQuiz(id) {
    if (id) {
      axios({
        url: `${API_URL}/quizzes/${id}`,
        method: 'delete',
        headers: this.props.userToken,
      })
      .then((response) => {
        if (!response || (response && response.status !== 200)) {
          this.setState({ errorState: true });
        }
        cookie.remove('current-session-id');
        cookie.remove('current-session-type');
        this.updateCurrentQuiz('default');
        this.reloadBar();
      });
    }
    this.closeModal();
  }
  /*
    Opens a modal that asks to delete a quiz according to the id.
  */
  deleteThisQuiz(id) {
    this.openModal({
      header: 'Delete this quiz?',
      body: 'Are you sure that you want to DELETE this quiz? This is an irreversible action and this quiz will not be available to your student any more!',
      buttons: ['close', 'deleteQuiz'],
      modalProps: { quizId: id },
    });
  }
  /*
    Saves the current quiz id in the cookie for later use.
  */
  saveCurrentQuiz(id) {
    this.id = id;
    this.setState({ currentID: id.toString() });
    cookie.save('current-session-id', id);
  }
  /*
    handles the click of the title in the sidebar in both student and teacher mode
  */
  handleSideBarTitleClick() {
    this.updateCurrentQuiz('default');
  }
  /*
    Decides which panel should be renderd according to the selected panels
    and  according to the user type currently on.
  */
  renderQuizContent() {
    let element = <h1><b> My Quizzes</b></h1>;
    if (this.state.panelType === 'default') {
      element = (<DefaultQuizzesPanel
        onSideBarItemClick={(id, panelType) => {
          this.updateCurrentQuiz(panelType);
          this.saveCurrentQuiz(id);
        }}
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
          deleteQuiz={(deletedID) => { this.reloadBar(); this.deleteThisQuiz(deletedID); }}
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
          quizID={this.state.currentID}
          handleSubmitButton={() => { this.reloadBar(); this.updateCurrentQuiz('viewer'); }}
          reloadSideBar={() => this.reloadBar()}
          handleError={type => this.updateCurrentQuiz(type)}
        />);
      }
    }
    return element;
  }
  /*
  Main render method
  */
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
        <ModalError
          show={this.state.showModal}
          content={this.state.modalContent}
          close={() => this.closeModal()}
          confirmDeleteQuiz={quizId => this.confirmDeleteQuiz(quizId)}
        />
      </div>
    );
  }
}

MyQuizzesPage.propTypes = {
  userToken: PropTypes.shape({}).isRequired,
};
