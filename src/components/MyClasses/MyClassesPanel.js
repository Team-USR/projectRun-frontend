import React, { PropTypes, Component } from 'react';
import { GroupQuizzes } from './GroupQuizzes';
import { GroupStudents } from './GroupStudents';
import { StudentsPanel } from './panels';

export default class MyClassesPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  renderPanel() {
    let element = <h3>Basic Panel</h3>;
    if (this.props.showAddQuizPanel) {
      element = <div><h3>Add Quiz Panel</h3></div>;
    } else if (this.props.showAddStudentPanel) {
      element = <StudentsPanel />;
    } else {
      element = (<div>
        <GroupQuizzes
          quizzes={this.props.content.quizzes}
          handleRemoveQuizClick={id => this.props.handleRemoveQuizClick(id)}
          handleAddQuizClick={() => this.props.handleAddQuizClick()}
        />
        <GroupStudents
          students={this.props.content.students}
          handleRemoveStudentClick={id => this.props.handleRemoveStudentClick(id)}
          handleAddStudentClick={() => this.props.handleAddStudentClick()}
        /></div>
      );
    }
    return element;
  }

  render() {
    return (
      <div className="groupQuizzesWrapper">
        <h2>{this.props.content.classTitle}</h2>
        { this.renderPanel() }
      </div>
    );
  }
}

MyClassesPanel.propTypes = {
  showAddQuizPanel: PropTypes.bool.isRequired,
  showAddStudentPanel: PropTypes.bool.isRequired,
  content: PropTypes.shape({
    classTitle: PropTypes.string.isRequired,
    quizzes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    students: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }).isRequired,
  handleRemoveQuizClick: PropTypes.func.isRequired,
  handleAddQuizClick: PropTypes.func.isRequired,
  handleRemoveStudentClick: PropTypes.func.isRequired,
  handleAddStudentClick: PropTypes.func.isRequired,
};
