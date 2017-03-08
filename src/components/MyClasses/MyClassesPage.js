import React, { PropTypes, Component } from 'react';
import axios from 'axios';
import { SideBarWrapper } from '../SideBar/index';
import { MyClassesPanel } from './index';
import { API_URL } from '../../constants';

export default class MyClassesPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      panelType: 'my_classes_default_panel',
      allQuizzes: [
        { quizId: 1, quizTitle: 'Math Quiz' },
        { quizId: 2, quizTitle: 'Philosophy Quiz' },
        { quizId: 3, quizTitle: 'Advanced Quiz' },
        { quizId: 4, quizTitle: 'Physics Quiz' },
        { quizId: 5, quizTitle: 'Anatomy Quiz' },
      ],
      sideBarContent: {},
      content: {},
      901: {
        classTitle: 'Class IX A ',
        quizzes: [
          { quizId: 1, quizTitle: 'Math Quiz' },
          { quizId: 2, quizTitle: 'Philosophy Quiz' },
          { quizId: 4, quizTitle: 'Physics Quiz' },
        ],
        students: [
          { studentID: 101, studentName: 'Gigel' },
          { studentID: 102, studentName: 'Jlaba' },
          { studentID: 103, studentName: 'Geon' },
          { studentID: 104, studentName: 'Blercu' },
        ],
      },
      902: {
        classTitle: 'Class IX B ',
        quizzes: [
          { quizId: 1, quizTitle: 'Math Quiz' },
          { quizId: 3, quizTitle: 'Advanced Quiz' },
        ],
        students: [
          { studentID: 101, studentName: 'Gigel' },
          { studentID: 103, studentName: 'Geon' },
          { studentID: 104, studentName: 'Blercu' },
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
          { studentID: 101, studentName: 'Gigel' },
          { studentID: 104, studentName: 'Blercu' },
        ],
      },
      904: {
        classTitle: 'Class XI A ',
        quizzes: [
          { quizId: 1, quizTitle: 'Math Quiz' },
          { quizId: 3, quizTitle: 'Advanced Quiz' },
        ],
        students: [
          { studentID: 104, studentName: 'Geon' },
          { studentID: 101, studentName: 'Gigel' },
        ],
      },
      905: {
        classTitle: 'Class XII A ',
        quizzes: [
          { quizId: 1, quizTitle: 'Math Quiz' },
          { quizId: 5, quizTitle: 'Anatomy Quiz' },
        ],
        students: [
          { studentID: 104, studentName: 'Blercu' },
        ],
      },
      test: {
        classTitle: 'Class Test',
        quizzes: [
          { quizId: 1, quizTitle: 'Math Quiz' },
          { quizId: 5, quizTitle: 'Anatomy Quiz' },
        ],
        students: [
          { studentID: 104, studentName: 'Geon' },
        ],
      },
    };
  }

  componentWillMount() {
    const getSideBar = {
      classes: [
        { className: 'Class IX A', classId: '901' },
        { className: 'Class IX B', classId: '902' },
        { className: 'Class X D', classId: '903' },
        { className: 'Class XI A', classId: '904' },
        { className: 'Class XII A', classId: '905' },
      ],
    };
    this.setState({ sideBarContent: getSideBar });
  }


  getClassContent(currentClass) {
    return this.state[currentClass];
  }

  handleSideBarTitleClick() {
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

  handleAddStudentClick() {
    this.setState({ panelType: 'manage_studens_panel' });
  }

  handleManageQuizzesFromClass() {
    this.setState({ panelType: 'manage_quizzes_panel' });
  }

  handleSideBarClassClick(currentClass) {
    const newContent = this.getClassContent(currentClass);
    this.setState({
      panelType: 'show_selected_class',
      content: newContent });
  }

  handleCreateClassClick() {
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
    .then((response) => {
      const data = response.data;
      const newSideBarContent = this.state.sideBarContent;
      newSideBarContent.classes.push({ className: newClassTitle, classId: data.id });
      this.setState({ sideBarContent: newSideBarContent });
    });
  }

  renderClassesPanel() {
    const element = (
      <MyClassesPanel
        panelType={this.state.panelType}
        userToken={this.props.userToken}
        content={this.state.content}
        allQuizzes={this.state.allQuizzes}
        numberOfClasses={this.state.sideBarContent.classes.length}
        handleSaveNewClassClick={newClassTitle => this.handleSaveNewClassClick(newClassTitle)}
        handleRemoveStudentClick={id => this.handleRemoveStudentClick(id)}
        handleAddStudentClick={() => this.handleAddStudentClick()}
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
