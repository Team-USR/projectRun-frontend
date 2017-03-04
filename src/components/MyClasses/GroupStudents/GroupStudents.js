import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { StudentManager } from './index';

export default class GroupStudents extends Component {

  renderStudents() {
    const populatedArray = [];
    this.state.studentsArray.map(item =>
      populatedArray.push(<li key={`student_manager_${item.userId}`}><StudentManager
        name={item.name}
        studentId={item.userId}
        removeStudent={userId => this.props.removeStudent(userId)}
      /></li>),
    );
    return populatedArray;
  }

  render() {
    return (<div className="groupStudentsContainer">
      <h1>Enrolled Students</h1>
      <ul>
        {this.renderStudents()}
      </ul>
      <Button onClick={this.props.addStudent}> Add Student </Button>
    </div>);
  }
}

GroupStudents.propTypes = {
  addStudent: PropTypes.func.isRequired,
  removeStudent: PropTypes.func.isRequired,
};
