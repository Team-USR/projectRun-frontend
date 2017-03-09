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
      allQuizzes: [
        { quizId: 1, quizTitle: 'Math Quiz' },
        { quizId: 2, quizTitle: 'Philosophy Quiz' },
        { quizId: 3, quizTitle: 'Advanced Quiz' },
        { quizId: 4, quizTitle: 'Physics Quiz' },
        { quizId: 5, quizTitle: 'Anatomy Quiz' },
      ],
      allStudents: [
        { studentId: 101, studentName: 'Gigel' },
        { studentId: 102, studentName: 'Jlaba' },
        { studentId: 103, studentName: 'Geon' },
        { studentId: 104, studentName: 'Blercu' },
      ],
      sideBarContent: { classes: [] },
      content: {},
      901: {
        classTitle: 'Class IX A ',
        quizzes: [
          { quizId: 1, quizTitle: 'Math Quiz' },
          { quizId: 2, quizTitle: 'Philosophy Quiz' },
          { quizId: 4, quizTitle: 'Physics Quiz' },
        ],
        students: [
          { studentId: 101, studentName: 'Gigel' },
          { studentId: 102, studentName: 'Jlaba' },
          { studentId: 103, studentName: 'Geon' },
          { studentId: 104, studentName: 'Blercu' },
        ],
      },
      902: {
        classTitle: 'Class IX B ',
        quizzes: [
          { quizId: 1, quizTitle: 'Math Quiz' },
          { quizId: 3, quizTitle: 'Advanced Quiz' },
        ],
        students: [
          { studentId: 101, studentName: 'Gigel' },
          { studentId: 103, studentName: 'Geon' },
          { studentId: 104, studentName: 'Blercu' },
        ],
      },
      903: {
        classTitle: 'Class X D ',
        quizzes: [
          { quizId: 1, quizTitle: 'Math Quiz' },
          { quizId: 2, quizTitle: 'Philosophy Quiz' },
          { quizId: 3, quizTitle: 'Advanced Quiz' },
          { quizId: 4, quizTitle: 'Physics Quiz' },
          { quizId: 5, quizTitle: 'Anatomy Quiz' },
        ],
        students: [
          { studentId: 101, studentName: 'Gigel' },
          { studentId: 104, studentName: 'Blercu' },
        ],
      },
      904: {
        classTitle: 'Class XI A ',
        quizzes: [
          { quizId: 1, quizTitle: 'Math Quiz' },
          { quizId: 3, quizTitle: 'Advanced Quiz' },
        ],
        students: [
          { studentId: 103, studentName: 'Geon' },
          { studentId: 101, studentName: 'Gigel' },
        ],
      },
      905: {
        classTitle: 'Class XII A ',
        quizzes: [
          { quizId: 1, quizTitle: 'Math Quiz' },
          { quizId: 5, quizTitle: 'Anatomy Quiz' },
        ],
        students: [
          { studentId: 104, studentName: 'Blercu' },
        ],
      },
      test: {
        classTitle: 'Class Test',
        quizzes: [
          { quizId: 1, quizTitle: 'Math Quiz' },
          { quizId: 5, quizTitle: 'Anatomy Quiz' },
        ],
        students: [
          { studentId: 104, studentName: 'Geon' },
        ],
      },
    };
  }

  componentWillMount() {
    axios({
      url: `${API_URL}/users/mine/groups`,
      headers: this.props.userToken,
    })
    .then((response) => {
      const newSideBarContent = { classes: response.data };

      setTimeout(() => {
        this.setState({ sideBarContent: newSideBarContent, loadingSideBar: false });
      }, 1200);
    });

    if (cookie.load('current-class-id') != null) {
      const classId = cookie.load('current-class-id');
      const newContent = this.getClassContent(classId);
      if (newContent) {
        this.setState({
          panelType: 'show_selected_class',
          content: newContent,
        });
      } else {
        this.setState({ panelType: 'my_classes_default_panel' });
      }
    }
  }

  getClassContent(currentClass) {
    // TODO: Make GET Request for a specific class;
    return this.state[currentClass];
  }

  reloadBar() {
    axios({
      url: `${API_URL}/users/mine/groups`,
      headers: this.props.userToken,
    })
    .then((response) => {
      const newSideBarContent = { classes: response.data };
      setTimeout(() => {
        this.setState({ sideBarContent: newSideBarContent, loadingSideBar: false });
      }, 1200);
    });
  }

  saveCurrentQuiz(id) {
    this.id = id;
    cookie.save('current-class-id', id.toString());
  }

  handleSideBarTitleClick() {
    cookie.remove('current-class-id');
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

  handleSideBarClassClick(currentClassId) {
    const newContent = this.getClassContent(currentClassId);
    this.saveCurrentQuiz(currentClassId);
    this.setState({
      panelType: 'show_selected_class',
      content: newContent });
  }

  handleCreateClassClick() {
    cookie.remove('current-class-id');
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
    .then(() => this.reloadBar());
  }

  renderClassesPanel() {
    const element = (
      <MyClassesPanel
        panelType={this.state.panelType}
        userToken={this.props.userToken}
        content={this.state.content}
        allQuizzes={this.state.allQuizzes}
        allStudents={this.state.allStudents}
        numberOfClasses={this.state.sideBarContent.classes.length}
        handleSaveNewClassClick={newClassTitle => this.handleSaveNewClassClick(newClassTitle)}
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
        onSideBarItemClick={currentClass =>
          this.handleSideBarClassClick(currentClass)}
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
