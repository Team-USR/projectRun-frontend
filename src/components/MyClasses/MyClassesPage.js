import React, { PropTypes, Component } from 'react';
import { SideBarWrapper } from '../SideBar/index';
import { MyClassesPanel } from './index';

export default class MyClassesPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showClassPanel: false,
      content: {},
      901: {
        classTitle: 'Class IX A ',
        quizzes: [
          { quizID: 1, quizTitle: 'Math Quiz' },
          { quizID: 2, quizTitle: 'Philosophy Quiz' },
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
          { quizID: 1, quizTitle: 'Math Quiz' },
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
          { quizID: 2, quizTitle: 'Philosophy Quiz' },
        ],
        students: [
          { studentID: 101, studentName: 'Gigel' },
          { studentID: 104, studentName: 'Blercu' },
        ],
      },
      904: {
        classTitle: 'Class XI C ',
        quizzes: [
          { quizID: 2, quizTitle: 'Math Quiz' },
        ],
        students: [
          { studentID: 101, studentName: 'Gigel' },
          { studentID: 104, studentName: 'Blercu' },
        ],
      },
      905: {
        classTitle: 'Class XII A ',
        quizzes: [
          { quizID: 2, quizTitle: 'Math Quiz' },
        ],
        students: [
          { studentID: 104, studentName: 'Blercu' },
        ],
      },
    };
  }

  getClassContent(currentClass) {
    // console.log(currentClass);
    return this.state[currentClass];
  }

  showClassPanel(show, currentClass) {
    const newContent = this.getClassContent(currentClass);
    // console.log('show');
    this.setState({ showClassPanel: show, content: newContent });
  }

  renderClassContent() {
    let element = <h1><b> My Classes</b></h1>;
    if (this.state.showClassPanel) {
      element = (<MyClassesPanel
        userToken={this.props.userToken}
        content={this.state.content}
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
