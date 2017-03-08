import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { StudentManager } from './index';

export default class GroupStudents extends Component {

  renderStudents() {
    return this.props.students.map(item =>
      <li key={`student_manager_${item.studentID}`}>
        <StudentManager
          name={item.studentName}
          studentId={item.studentID}
          removeStudent={id => this.props.handleRemoveStudentClick(id)}
        />
      </li>,
    );
  }

  render() {
    return (
      <div className="groupStudentsWrapper">
        <h1>Enrolled Students</h1>
        <ul>
          {this.renderStudents()}
        </ul>
        <Button onClick={this.props.handleAddStudentClick}> Add Student </Button>
      </div>
    );
  }
}

GroupStudents.propTypes = {
  students: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleAddStudentClick: PropTypes.func.isRequired,
  handleRemoveStudentClick: PropTypes.func.isRequired,
};
