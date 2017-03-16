import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';

export default class GroupStudents extends Component {

  renderStudents() {
    if (this.props.students.length === 0) {
      return <h4>There are no students enrolled in this class!</h4>;
    }
    return this.props.students.map(obj =>
      <li key={`group_student_${obj.id}`}>
        <span><b> {obj.name} </b></span>
      </li>,
    );
  }

  render() {
    return (
      <div className="groupStudentsWrapper">
        <h1>Enrolled Students</h1>
        <ul>
          { this.renderStudents() }
        </ul>
        <Button onClick={this.props.handleManageStudentsFromClass}> Manage Section </Button>
      </div>
    );
  }
}

GroupStudents.propTypes = {
  students: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleManageStudentsFromClass: PropTypes.func.isRequired,
};
