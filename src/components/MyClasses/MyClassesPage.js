import React, { PropTypes, Component } from 'react';
import { SideBarWrapper } from '../SideBar/index';
import { MyClassesPanel } from './index';

export default class MyClassesPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showClassPanel: false,
      showAddQuizPanel: false,
      showAddStudentPanel: false,
      content: {},
      901: {
        classTitle: 'Class IX A ',
        quizzes: [
          { quizId: 1, quizTitle: 'Math Quiz' },
          { quizId: 2, quizTitle: 'Philosophy Quiz' },
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
          { quizId: 2, quizTitle: 'Philosophy Quiz' },
        ],
        students: [
          { studentID: 101, studentName: 'Gigel' },
          { studentID: 104, studentName: 'Blercu' },
        ],
      },
      904: {
        classTitle: 'Class XI C ',
        quizzes: [
          { quizId: 2, quizTitle: 'Math Quiz' },
        ],
        students: [
          { studentID: 104, studentName: 'Geon' },
          { studentID: 101, studentName: 'Gigel' },
        ],
      },
      905: {
        classTitle: 'Class XII A ',
        quizzes: [
          { quizId: 2, quizTitle: 'Math Quiz' },
        ],
        students: [
          { studentID: 104, studentName: 'Blercu' },
        ],
      },
    };
  }

  getClassContent(currentClass) {
    return this.state[currentClass];
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
    this.setState({ showAddStudentPanel: true, showAddQuizPanel: false });
  }

  handleRemoveQuizClick(id) {
    this.id = id;
  }

  handleAddQuizClick() {
    this.setState({ showAddStudentPanel: false, showAddQuizPanel: true });
  }

  showClassPanel(show, currentClass) {
    const newContent = this.getClassContent(currentClass);
    this.setState({
      showClassPanel: show,
      showAddQuizPanel: false,
      showAddStudentPanel: false,
      content: newContent });
  }

  renderClassContent() {
    let element = <h1><b> My Classes</b></h1>;
    if (this.state.showClassPanel) {
      element = (
        <MyClassesPanel
          showAddQuizPanel={this.state.showAddQuizPanel}
          showAddStudentPanel={this.state.showAddStudentPanel}
          userToken={this.props.userToken}
          content={this.state.content}
          handleRemoveStudentClick={id => this.handleRemoveStudentClick(id)}
          handleAddStudentClick={() => this.handleAddStudentClick()}
          handleRemoveQuizClick={id => this.handleRemoveQuizClick(id)}
          handleAddQuizClick={() => this.handleAddQuizClick()}
        />);
    }
    return element;
  }

  render() {
    return (
      <div className="myClassesPageWrapper">
        <SideBarWrapper
          onSideBarItemClick={(showClass, currentClass) =>
            this.showClassPanel(showClass, currentClass)}
          title={'My Classes'}
          type={'SideBarClasses'}
        />
        <div className="contentWrapper">
          { this.renderClassContent() }
        </div>
      </div>
    );
  }
}

MyClassesPage.propTypes = {
  userToken: PropTypes.string.isRequired,
};
