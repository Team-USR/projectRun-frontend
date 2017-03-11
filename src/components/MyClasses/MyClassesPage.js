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
      currentClassId: 0,
      allQuizzes: [],
      allStudents: [
        { id: 101, name: 'Gigel' },
        { id: 102, name: 'Jlaba' },
        { id: 103, name: 'Geon' },
        { id: 104, name: 'Blercu' },
      ],
      sideBarContent: { classes: [] },
      content: { quizzes: [], students: [] },
    };
  }

  componentWillMount() {
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

      const newSideBarContent = { classes: response.data.reverse() };
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
        // console.log(studentsResponse.data);
        newContent.students = studentsResponse.data;
      });
      this.setState({ panelType: 'show_selected_class', content: newContent });
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
    cookie.save('current-class-id', id.toString());
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
    // const studentsIdArray = newStundentsArray.map(obj => obj.id);
    // const postObject = { students: studentsIdArray };
    // const groupId = this.state.currentClassId.toString();

    // console.log(studentsIdArray);
    // axios({
    //   url: `${API_URL}/groups/${groupId}/quizzes_update`,
    //   method: 'post',
    //   data: postObject,
    //   headers: this.props.userToken,
    // })
    // .then(() => this.setState({ panelType: 'show_selected_class' }));
  }

  renderClassesPanel() {
    const element = (
      <MyClassesPanel
        classId={this.state.currentClassId}
        panelType={this.state.panelType}
        userToken={this.props.userToken}
        classTitle={this.state.currentClassTitle}
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
