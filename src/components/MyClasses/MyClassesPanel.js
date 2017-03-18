import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';
import { GroupQuizzes } from './GroupQuizzes';
import { GroupStudents } from './GroupStudents';
import { STUDENT, TEACHER } from '../../constants';
import {
  StudentsPanel,
  QuizzesPanel,
  DefaultClassesPanel,
  CreateClassPanel,
} from './panels';

export default class MyClassesPanel extends Component {
  constructor() {
    super();
    this.state = {
      filteredStudents: [],
    };
  }
  componentWillMount() {
    this.setState({ filteredStudents: this.props.content.students });
  }
  filterItems(value) {
    let found = false;
    let filtered = this.props.content.students.filter((item) => {
      if (item.name.toLowerCase() === value.toLowerCase() ||
          item.name.toLowerCase().includes(value.toLowerCase())) {
        found = true;
        return (item);
      }
      return (null);
    });
    if (!found && value !== '') {
      filtered = [];
    } else
    if (filtered.length === 0 || value === '') {
      filtered = this.props.content.students;
    }
    this.setState({ filteredStudents: filtered });
  }
  manageSearch(value) {
    this.filterItems(value);
  }
  renderPanel() {
    let element = (
      <DefaultClassesPanel
        userType={this.props.userType}
        numberOfClasses={this.props.numberOfClasses}
      />
    );
    const classTitle = (
      <div>
        <h2><b>{this.props.classTitle}</b></h2>
        <hr />
      </div>
    );
    if (this.props.userType === TEACHER) {
      if (this.props.panelType === 'manage_quizzes_panel') {
        element = (
          <div className="manageQuizzesWrapper">
            { classTitle }
            <QuizzesPanel
              handleSaveAssignedQuizzes={newQuizzesArray =>
                this.props.handleSaveAssignedQuizzes(newQuizzesArray)}
              quizzes={this.props.content.quizzes}
              allQuizzes={this.props.allQuizzes}
            />
          </div>);
      }

      if (this.props.panelType === 'manage_studens_panel') {
        element = (
          <div className="manageStudentsWrapper">
            { classTitle }
            <StudentsPanel
              handleSaveEnrolledStudents={newStudentsArray =>
                this.props.handleSaveEnrolledStudents(newStudentsArray)}
              students={this.props.content.students}
              filteredStudents={this.state.filteredStudents}
              allStudents={this.props.allStudents}
              manageSearch={value => this.manageSearch(value)}
              forceFilter={value => this.filterItems(value)}
            />
          </div>
        );
      }

      if (this.props.panelType === 'show_selected_class') {
        element = (
          <div>
            { classTitle }
            <GroupQuizzes
              userType={this.props.userType}
              quizzes={this.props.content.quizzes}
              handleManageQuizzesFromClass={() => this.props.handleManageQuizzesFromClass()}
            />
            <hr />
            <GroupStudents
              userType={this.props.userType}
              students={this.props.content.students}
              handleManageStudentsFromClass={() => this.props.handleManageStudentsFromClass()}
            />
            <hr />
            <Button
              onClick={() =>
              this.props.handleDeleteClass(this.props.classId)}
            >Delete Class</Button>
          </div>
        );
      }

      if (this.props.panelType === 'create_new_class') {
        element = (
          <CreateClassPanel
            handleSaveNewClassClick={newClassTitle =>
              this.props.handleSaveNewClassClick(newClassTitle)}
          />
        );
      }
    } else if (this.props.userType === STUDENT) {
      if (this.props.panelType === 'show_selected_class') {
        element = (
          <div>
            { classTitle }
            <GroupQuizzes
              userType={this.props.userType}
              quizzes={this.props.content.quizzes}
            />
            <hr />
          </div>
        );
      }
    }
    return element;
  }

  render() {
    return (
      <div className="groupPanelWrapper">
        { this.renderPanel() }
      </div>
    );
  }
}

MyClassesPanel.propTypes = {
  userType: PropTypes.string.isRequired,
  classId: PropTypes.string.isRequired,
  classTitle: PropTypes.string.isRequired,
  panelType: PropTypes.string.isRequired,
  content: PropTypes.shape({
    quizzes: PropTypes.arrayOf(PropTypes.shape({})),
    students: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  allQuizzes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  allStudents: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  numberOfClasses: PropTypes.number.isRequired,
  handleSaveNewClassClick: PropTypes.func.isRequired,
  handleSaveAssignedQuizzes: PropTypes.func.isRequired,
  handleSaveEnrolledStudents: PropTypes.func.isRequired,
  handleManageQuizzesFromClass: PropTypes.func.isRequired,
  handleManageStudentsFromClass: PropTypes.func.isRequired,
  handleDeleteClass: PropTypes.func.isRequired,
  manageSearch: PropTypes.func.isRequired,
};
