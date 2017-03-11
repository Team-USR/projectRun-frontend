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
      newStudentsObj[obj.id] = obj.name;
      return 0;
    });

    return this.props.allStudents.filter((obj) => {
      if (!newStudentsObj[obj.id]) {
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
    return emptyArray;
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
      <li key={`enrolled_student_${obj.id}`}>
        <StudentManager
          type={'remove'}
          id={obj.id}
          index={index}
          name={obj.name}
          removeStudent={studentIndex => this.removeStudent(studentIndex)}
        />
      </li>,
    );
  }

  renderUnenrolledStudents() {
    if (this.state.unenrolledStudents.length === 0) {
      return <h4>All students have been enrolled!</h4>;
    }
    return this.state.unenrolledStudents.map((obj, index) =>
      <li key={`unenrolled_student_${obj.id}`}>
        <StudentManager
          type={'add'}
          id={obj.id}
          index={index}
          name={obj.name}
          addStudent={studentIndex => this.addStudent(studentIndex)}
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
            <input type="file" style={{ marginLeft: '500px' }} ref={(csvfile) => { this.csv = csvfile; }} accept=".csv" onChange={this.importCSV} />
            <p style={{ color: 'red' }}>{this.state.errorMessage}</p>
            <Button onClick={this.parseFile}>Ghici ciuperca</Button>
            <ul>{this.showCsvData()}</ul>
            {this.showAddButton()}
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
          <Button
            onClick={() =>
              this.props.handleSaveEnrolledStudents(this.state.enrolledStudents)}
          > Save </Button>
        </Col>
      </div>
    );
  }
}

StudentsPanel.propTypes = {
  students: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  allStudents: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleSaveEnrolledStudents: PropTypes.func.isRequired,
};
