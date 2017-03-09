import React, { PropTypes, Component } from 'react';
import { Button, Col } from 'react-bootstrap';
import { StudentManager } from '../GroupStudents';

export default class StudentsPanel extends Component {
  constructor() {
    super();
    this.state = {
      value: '',
      enrolledStudents: [],
      unenrolledStudents: [],
    };
    this.changeInput = this.changeInput.bind(this);
  }

  componentWillMount() {
    this.setState({
      enrolledStudents: this.props.students,
      unenrolledStudents: this.getUnenrolledStudents(),
    });
  }

  getUnenrolledStudents() {
    const newStudentsObj = {};
    this.props.students.map((obj) => {
      newStudentsObj[obj.studentId] = obj.studentName;
      return 0;
    });

    return this.props.allStudents.filter((obj) => {
      if (!newStudentsObj[obj.studentId]) {
        return true;
      }
      return false;
    });
  }

  changeInput(event) {
    this.setState({ value: event.target.value });
  }

  addStudent(index) {
    const newEnrolledObj = this.state.enrolledStudents;
    newEnrolledObj.push(this.state.unenrolledStudents[index]);

    const newUnenrolledObj = this.state.unenrolledStudents;
    newUnenrolledObj.splice(index, 1);

    this.setState({
      enrolledStudents: newEnrolledObj,
      unenrolledStudents: newUnenrolledObj,
    });
  }

  removeStudent(index) {
    const newUnenrolledObj = this.state.unenrolledStudents;
    newUnenrolledObj.push(this.state.enrolledStudents[index]);

    const newEnrolledObj = this.state.enrolledStudents;
    newEnrolledObj.splice(index, 1);

    this.setState({
      enrolledStudents: newEnrolledObj,
      unenrolledStudents: newUnenrolledObj,
    });
  }

  renderEnrolledStudents() {
    if (this.state.enrolledStudents.length === 0) {
      return <h4>There are no students enrolled in this class!</h4>;
    }
    return this.state.enrolledStudents.map((obj, index) =>
      <li key={`enrolled_student_${obj.studentId}`}>
        <StudentManager
          type={'remove'}
          id={obj.studentId}
          index={index}
          name={obj.studentName}
          removeStudent={id => this.removeStudent(id)}
        />
      </li>,
    );
  }

  renderUnenrolledStudents() {
    if (this.state.unenrolledStudents.length === 0) {
      return <h4>All students have been enrolled!</h4>;
    }
    return this.state.unenrolledStudents.map((obj, index) =>
      <li key={`unenrolled_student_${obj.studentId}`}>
        <StudentManager
          type={'add'}
          id={obj.studentId}
          index={index}
          name={obj.studentName}
          addStudent={id => this.addStudent(id)}
        />
      </li>,
    );
  }

  render() {
    return (
      <div className="studentsPanelWrapper">
        <Col md={12}>
          <form>
            <input value={this.state.value} onChange={this.changeInput} />
            <input style={{ marginLeft: '500px' }} ref={(c) => { this.file = c; }} type="file" onClick={this.importCSV} />
            <Button onClick={this.parseFile}>Ghici ciuperca</Button>
          </form>
        </Col>
        <Col md={12}>
          <h3>Manage enrolled Students</h3>
          <hr />
        </Col>
        <Col md={12} className="studentsList">
          <Col md={6}>
            <ul>
              { this.renderEnrolledStudents() }
            </ul>
          </Col>
          <Col md={6}>
            <ul>
              { this.renderUnenrolledStudents() }
            </ul>
          </Col>
        </Col>
        <Col md={12}>
          <hr />
        </Col>
      </div>
    );
  }
}

StudentsPanel.propTypes = {
  students: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  allStudents: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
