import React, { PropTypes, Component } from 'react';
import { GroupQuizzes } from './GroupQuizzes';
import { GroupStudents } from './GroupStudents';
import {
  StudentsPanel,
  QuizzesPanel,
  DefaultClassesPanel,
  CreateClassPanel,
} from './panels';

export default class MyClassesPanel extends Component {

  renderPanel() {
    let element = <DefaultClassesPanel numberOfClasses={this.props.numberOfClasses} />;
    const classTitle = (
      <div>
        <h2><b>{this.props.classTitle}</b></h2>
        <hr />
      </div>
    );
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
            students={this.props.content.students}
            allStudents={this.props.allStudents}
          />
        </div>
      );
    }

    if (this.props.panelType === 'show_selected_class') {
      element = (<div>
        { classTitle }
        <GroupQuizzes
          quizzes={this.props.content.quizzes}
          handleManageQuizzesFromClass={() => this.props.handleManageQuizzesFromClass()}
        />
        <hr />
        <GroupStudents
          students={this.props.content.students}
          handleRemoveStudentClick={id => this.props.handleRemoveStudentClick(id)}
          handleManageStudentsFromClass={() => this.props.handleManageStudentsFromClass()}
        /></div>
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
  handleManageQuizzesFromClass: PropTypes.func.isRequired,
  handleRemoveStudentClick: PropTypes.func.isRequired,
  handleManageStudentsFromClass: PropTypes.func.isRequired,
};
