import React, { PropTypes, Component } from 'react';
import cookie from 'react-cookie';
import axios from 'axios';
import { API_URL } from '../../constants';
import { SideBarWrapper } from '../SideBar';
import { MyClassesPanel } from './index';
import { BrandSpinner } from '../utils';

export default class MyClassesPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      panelType: 'my_classes_default_panel',
      loadingSideBar: true,
      currentClassTitle: '',
      currentClassId: '',
      allQuizzes: [],
      allStudents: [
        { id: 9, name: 'Geon' },
        { id: 10, name: 'Gigel' },
        { id: 11, name: 'Jlaba' },
        { id: 12, name: 'Blercu' },
      ],
      sideBarContent: { classes: [] },
      content: { quizzes: [], students: [] },
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

  getClassContent(currentClassId) {
    axios({
      url: `${API_URL}/groups/${currentClassId}/quizzes`,
      headers: this.props.userToken,
    })
    .then((response) => {
      const newContent = this.state.content;
      newContent.quizzes = response.data;

      axios({
        url: `${API_URL}/groups/${currentClassId}/students`,
        headers: this.props.userToken,
      })
      .then((studentsResponse) => {
        newContent.students = studentsResponse.data;
        this.setState({ panelType: 'show_selected_class', content: newContent });
      });
    });
  }

  requestTeacherData() {
    axios({
      url: `${API_URL}/users/mine/groups`,
      headers: this.props.userToken,
    })
    .then((response) => {
      axios({
        url: `${API_URL}/quizzes/mine`,
        headers: this.props.userToken,
      })
      .then((quizzesResponse) => {
        this.setState({ allQuizzes: quizzesResponse.data });
      });

      const newSideBarContent = { classes: response.data.filter(obj => obj.role === 'admin').reverse() };
      const cookieClassId = cookie.load('current-class-id');
      const cookieClassTitle = cookie.load('current-class-title');

      if (cookieClassId != null && cookieClassTitle != null) {
        const classId = cookie.load('current-class-id');
        const classTitle = cookie.load('current-class-title');
        this.getClassContent(classId);

        setTimeout(() => {
          this.setState({
            currentClassId: classId,
            currentClassTitle: classTitle,
            sideBarContent: newSideBarContent,
            loadingSideBar: false,
          });
        }, 1200);
      } else {
        setTimeout(() => {
          this.setState({
            panelType: 'my_classes_default_panel',
            sideBarContent: newSideBarContent,
            loadingSideBar: false,
          });
        }, 1200);
      }
    });
  }

  requestStudentData() {
    axios({
      url: `${API_URL}/users/mine/groups`,
      headers: this.props.userToken,
    })
    .then((response) => {
      const newSideBarContent = { classes: response.data.filter(obj => obj.role === 'student').reverse() };
      const cookieClassId = cookie.load('current-class-id');
      const cookieClassTitle = cookie.load('current-class-title');

      if (cookieClassId != null && cookieClassTitle != null) {
        const classId = cookie.load('current-class-id');
        const classTitle = cookie.load('current-class-title');
        this.getClassContent(classId);

        setTimeout(() => {
          this.setState({
            currentClassId: classId,
            currentClassTitle: classTitle,
            sideBarContent: newSideBarContent,
            loadingSideBar: false,
          });
        }, 1200);
      } else {
        setTimeout(() => {
          this.setState({
            panelType: 'my_classes_default_panel',
            sideBarContent: newSideBarContent,
            loadingSideBar: false,
          });
        }, 1200);
      }
    });
  }

  reloadBar() {
    axios({
      url: `${API_URL}/users/mine/groups`,
      headers: this.props.userToken,
    })
    .then((response) => {
      const newSideBarContent = { classes: response.data.reverse() };
      setTimeout(() => {
        this.setState({ sideBarContent: newSideBarContent });
      }, 1200);
    });
  }

  saveCurrentClass(id, title) {
    this.id = id;
    cookie.save('current-class-id', id);
    cookie.save('current-class-title', title);
  }

  handleSideBarTitleClick() {
    cookie.remove('current-class-id');
    cookie.remove('current-class-title');
    this.setState({ panelType: 'my_classes_default_panel' });
  }

  handleManageStudentsFromClass() {
    this.setState({ panelType: 'manage_studens_panel' });
  }

  handleManageQuizzesFromClass() {
    this.setState({ panelType: 'manage_quizzes_panel' });
  }

  handleSideBarClassClick(classId, classTitle) {
    this.getClassContent(classId);
    this.saveCurrentClass(classId, classTitle);
    this.setState({ currentClassId: classId, currentClassTitle: classTitle });
  }

  handleCreateClassClick() {
    cookie.remove('current-class-id');
    cookie.remove('current-class-title');
    this.setState({ panelType: 'create_new_class' });
  }

  handleSaveNewClassClick(newClassTitle) {
    const newClassObj = { name: newClassTitle };
    axios({
      url: `${API_URL}/groups`,
      method: 'post',
      data: newClassObj,
      headers: this.props.userToken,
    })
    .then(() => {
      this.reloadBar();
    });
  }

  handleDeleteClass(classId) {
    axios({
      url: `${API_URL}/groups/${classId}`,
      method: 'delete',
      headers: this.props.userToken,
    })
    .then(() => {
      this.reloadBar();
      cookie.remove('current-class-id');
      cookie.remove('current-class-title');
      this.setState({ panelType: 'my_classes_default_panel' });
    });
  }

  handleSaveAssignedQuizzes(newQuizzesArray) {
    this.newQuizzesArray = [];
    const quizzesIdArray = newQuizzesArray.map(obj => obj.id);
    const postObject = { quizzes: quizzesIdArray };
    const groupId = this.state.currentClassId.toString();
    axios({
      url: `${API_URL}/groups/${groupId}/quizzes_update`,
      method: 'post',
      data: postObject,
      headers: this.props.userToken,
    })
    .then(() => this.setState({ panelType: 'show_selected_class' }));
  }

  handleSaveEnrolledStudents(newStundentsArray) {
    this.newStundentsArray = newStundentsArray;
    const studentsIdArray = newStundentsArray.map(obj => obj.id);
    const postObject = { users: studentsIdArray };
    const groupId = this.state.currentClassId.toString();

    axios({
      url: `${API_URL}/groups/${groupId}/users_update`,
      method: 'post',
      data: postObject,
      headers: this.props.userToken,
    })
    .then(() => this.setState({ panelType: 'show_selected_class' }));
  }

  renderClassesPanel() {
    const element = (
      <MyClassesPanel
        userToken={this.props.userToken}
        userType={this.state.userT}
        classId={this.state.currentClassId}
        classTitle={this.state.currentClassTitle}
        panelType={this.state.panelType}
        content={this.state.content}
        allQuizzes={this.state.allQuizzes}
        allStudents={this.state.allStudents}
        numberOfClasses={this.state.sideBarContent.classes.length}
        handleSaveNewClassClick={newClassTitle =>
          this.handleSaveNewClassClick(newClassTitle)}
        handleSaveAssignedQuizzes={newQuizzesArray =>
          this.handleSaveAssignedQuizzes(newQuizzesArray)}
        handleSaveEnrolledStudents={newStudentsArray =>
          this.handleSaveEnrolledStudents(newStudentsArray)}
        handleManageStudentsFromClass={() => this.handleManageStudentsFromClass()}
        handleManageQuizzesFromClass={() => this.handleManageQuizzesFromClass()}
        handleDeleteClass={id => this.handleDeleteClass(id)}
      />);
    return element;
  }

  renderSideBar() {
    const sidebar = (
      <SideBarWrapper
        onSideBarTitleClick={() => this.handleSideBarTitleClick()}
        onCreateClassClick={() => this.handleCreateClassClick()}
        sideBarContent={this.state.sideBarContent}
        onSideBarItemClick={(currentClassId, classTitle) =>
          this.handleSideBarClassClick(currentClassId, classTitle)}
        title={'My Classes'}
        type={'SideBarClasses'}
        userType={this.state.userT}
      />
    );

    return sidebar;
  }

  render() {
    if (this.state.loadingSideBar) {
      return <BrandSpinner />;
    }
    return (
      <div className="myClassesPageWrapper">
        { this.renderSideBar() }
        <div className="contentWrapper">
          { this.renderClassesPanel() }
        </div>
      </div>
    );
  }
}

MyClassesPage.propTypes = {
  userToken: PropTypes.shape({}).isRequired,
};
