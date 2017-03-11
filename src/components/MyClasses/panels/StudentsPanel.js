import Papa from 'papaparse';
import React, { PropTypes, Component } from 'react';
import { Button, Col } from 'react-bootstrap';
import { StudentManager } from '../GroupStudents';

export default class StudentsPanel extends Component {
  constructor() {
    super();
    this.state = { value: '',
      file: {},
      errorMessage: '',
      csvData: [],
      enrolledStudents: [],
      unenrolledStudents: [],
    };
    this.changeInput = this.changeInput.bind(this);
    this.importCSV = this.importCSV.bind(this);
    this.parseFile = this.parseFile.bind(this);
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

  importCSV() {
    let fileToParse = this.csv.files[0];
    if (fileToParse === undefined) {
      fileToParse = {};
      this.setState({ csvData: [] });
    }
    this.setState({ file: fileToParse, errorMessage: '' });
    // console.log(fileToParse);
  }

  parseFile() {
    if (Object.keys(this.state.file).length === 0 && this.state.file.constructor === Object) {
      this.setState({ errorMessage: 'File input cannot be empty!' });
      // console.log('empty object');
      return;
    }
    // console.log('not empty');
    Papa.parse(this.state.file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        // console.log(results.data[0].email);
        const emptyArray = [];
        results.data.map(object =>
          emptyArray.push(object.email),
        );
        this.setState({ csvData: emptyArray });
      },
    });
  }

  showCsvData() {
    const emptyArray = [];
    this.state.csvData.map((email, index) => {
      const ind = index;
      emptyArray.push(
        <li key={`student_email_${ind}`}>
          {email}
        </li>,
      );
      return ('');
    });
    const arrayToRet = [];
    if (emptyArray.length > 12) {
      for (let i = 0; i < 10; i += 1) {
        arrayToRet.push(emptyArray[i]);
      }
      arrayToRet.push(<li>And {emptyArray.length - 11} more</li>);
    } else {
      return emptyArray;
    }
    return arrayToRet;
  }

  showLabel() {
    if (this.state.csvData.length !== 0) {
      return (<h4> Retrieved students from file:</h4>);
    }
    return ('');
  }

  showAddButton() {
    if (this.state.csvData.length !== 0) {
      return (<Button> Add students to class</Button>);
    }
    return ('');
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
        <Col md={12} >
          <div className="form_container">
            <div className="form_section">
              <h2> Invite student </h2>
              <div className="inside">
                <p>Enter email to invite student to class:</p>
                <input
                  className="student_input"
                  value={this.state.value} placeholder="Student email"onChange={this.changeInput}
                />
                <Button >Invite student</Button>
              </div>
            </div>
            <div className="form_section">
              <h2> Import students </h2>
              <div className="inside">
                <p>Select a .csv file to retrieve the emails.</p><input
                  type="file"
                  ref={(csvfile) => { this.csv = csvfile; }} accept=".csv" onChange={this.importCSV}
                />
                <p style={{ color: 'red' }}>{this.state.errorMessage}</p>
                <Button onClick={this.parseFile}>Read file</Button>
                {this.showLabel()}
                <ul>{this.showCsvData()}</ul>
                {this.showAddButton()}
              </div>
            </div>
          </div>
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
