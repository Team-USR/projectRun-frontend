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
        { studentId: 101, studentName: 'Gigel' },
        { studentId: 102, studentName: 'Jlaba' },
        { studentId: 103, studentName: 'Geon' },
        { studentId: 104, studentName: 'Blercu' },
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
        // console.log(quizzesResponse);
        this.setState({ allQuizzes: quizzesResponse.data });
      });

      const newSideBarContent = { classes: response.data.reverse() };
      const cookieClassId = cookie.load('current-class-id');
      const cookieClassTitle = cookie.load('current-class-title');

      if (cookieClassId != null && cookieClassTitle != null) {
        const classId = cookie.load('current-class-id');
        const classTitle = cookie.load('current-class-title');
        this.getClassContent(classId);

        // console.log(newSideBarContent);
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
    // console.log(currentClassId.toString());

    axios({
      url: `${API_URL}/groups/${currentClassId}/quizzes`,
      headers: this.props.userToken,
    })
    .then((response) => {
      // console.log('RESPONSE', response);
      const newContent = this.state.content;
      newContent.quizzes = response.data;

      // TODO: Replace this with Request for Students;
      newContent.students =
      [
        { studentId: 101, studentName: 'Gigel' },
        { studentId: 103, studentName: 'Geon' },
        { studentId: 104, studentName: 'Blercu' },
      ];

      this.setState({ panelType: 'show_selected_class', content: newContent });
    });
  }

  reloadBar() {
    // console.log('RELOAD');
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

  handleRemoveStudentClick(id) {
    this.id = id;
    // const studentsCopy = this.state.studentsArray;
    // const tempPos = studentsCopy.map(item => item.userId).indexOf(id);
    // if (tempPos !== -1) {
    //   studentsCopy.splice(tempPos, 1);
    // }
    // this.setState({ studentsArray: studentsCopy });
  }

  handleAddStudentClick(id) {
    this.id = id;
  }

  handleManageStudentsFromClass() {
    this.setState({ panelType: 'manage_studens_panel' });
  }

  handleManageQuizzesFromClass() {
    this.setState({ panelType: 'manage_quizzes_panel' });
  }

  handleSideBarClassClick(classId, classTitle) {
    // console.log(classId);
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
    },
  );
  }

  handleSaveAssignedQuizzes(newQuizzesArray) {
    this.newQuizzesArray = [];
    const quizzesIdArray = newQuizzesArray.map(obj => obj.id);
    const postObject = { quizzes: quizzesIdArray };
    const groupId = this.state.currentClassId.toString();
    // console.log(postObject);
    axios({
      url: `${API_URL}/groups/${groupId}/quizzes_update`,
      method: 'post',
      data: postObject,
      headers: this.props.userToken,
    })
    .then(() => this.setState({ panelType: 'show_selected_class' }));
  }

  renderClassesPanel() {
    const element = (
      <MyClassesPanel
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
        handleRemoveStudentClick={id => this.handleRemoveStudentClick(id)}
        handleManageStudentsFromClass={() => this.handleManageStudentsFromClass()}
        handleManageQuizzesFromClass={() => this.handleManageQuizzesFromClass()}
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
