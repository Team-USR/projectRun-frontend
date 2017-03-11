import React, { PropTypes, Component } from 'react';
import cookie from 'react-cookie';
import axios from 'axios';
import { QuizCreatorMainPage, QuizCreatorReviewer, QuizEditorMainPage } from './../../quizManager/quizzesCreatorPage';
import { QuizViewerMainPage } from './../../quizManager/quizzesViewerPage';
import { SideBarWrapper } from '../SideBar/index';
import { API_URL } from '../../constants';
import { BrandSpinner } from '../utils';

export default class MyQuizzesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      panelType: 'my_quizzes_default_panel',
      currentID: -1,
      sideBarContent: {},
      loadingSideBar: true,
      contentLoading: true,
      userT: 'student',
    };
  }
  componentWillMount() {
    if (this.state.userT === 'teacher') { // CHANGE TO TEACHER
      this.requestTeacherData();
    }
    if (this.state.userT === 'student') {
      this.requestStudentData();
    }
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
      const newSideBarContent = { session: response.data.reverse() };
  //  console.log("My quizzes", response.data);
  //  this.setState({ sideBarContent: newSideBarContent, loadingSideBar: false });
      setTimeout(() => {
        this.setState({
          sideBarContent: newSideBarContent,
          loadingSideBar: false,
        });
      }, 1200);
    });
    let pType = 'default';
    let quizID = -1;
    if (cookie.load('current-session-type') != null && cookie.load('current-session-id') != null) {
      pType = cookie.load('current-session-type');
      quizID = cookie.load('current-session-id');
      this.setState({ panelType: pType, currentID: quizID });
    }
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
    //  console.log("My quizzes", response.data);
      const newSideBarContent = { quizzes: response.data.reverse() };
    //  this.setState({ sideBarContent: newSideBarContent, loadingSideBar: false });
      setTimeout(() => {
        this.setState({
          sideBarContent: newSideBarContent,
          loadingSideBar: false,
        });
      }, 1200);
    });
    let pType = 'default';
    let quizID = -1;
    if (cookie.load('current-session-type') != null && cookie.load('current-session-id') != null) {
      pType = cookie.load('current-session-type');
      quizID = cookie.load('current-session-id');
      this.setState({ panelType: pType, currentID: quizID });
    }
  }
  reloadBar() {
    axios({
      url: `${API_URL}/quizzes/mine`,
      headers: this.props.userToken,
    })
    .then((response) => {
      if (!response || (response && response.status !== 200)) {
        this.setState({ errorState: true });
      }
    //  console.log("My quizzes", response.data);
      const newSideBarContent = { quizzes: response.data };
      this.setState({ sideBarContent: newSideBarContent, loadingSideBar: false });
    });
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
    this.todo = 'TO DO';
    // this.setState({ panelType: 'my_classes_default_panel' });
  }
  renderQuizContent() {
//    console.log("rendering",this.state.currentID);
    let element = <h1><b> My Quizzes</b></h1>;
    if (this.state.userT === 'teacher') {
      if (this.state.panelType === 'reviewer') {
        element = (<QuizCreatorReviewer
          quizID={this.state.currentID}
          userToken={this.props.userToken}
          handlePublish={() => this.reloadBar()}
          handleSubmitButton={() => this.updateCurrentQuiz('editor')}
          deleteQuiz={deletedID => this.deleteThisQUiz(deletedID)}
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
          handlePublish={(id) => { this.reloadBar(); this.saveCurrentQuiz(id); }}
          handleSubmitButton={() => this.updateCurrentQuiz('reviewer')}
        />);
      }
    }
    if (this.state.userT === 'student') {
      if (this.state.panelType === 'viewer') {
        element = (<QuizViewerMainPage
          userToken={this.props.userToken}
          quizID={this.state.currentID} // this.state.currentID
          handleSubmitButton={() => this.updateCurrentQuiz('viewer')}
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
