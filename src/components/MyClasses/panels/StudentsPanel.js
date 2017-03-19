import Papa from 'papaparse';
import React, { PropTypes, Component } from 'react';
import { Button, Col, NavItem } from 'react-bootstrap';
import { StudentManager } from '../GroupStudents';
import { SearchSpinner } from '../../../components/utils';

export default class StudentsPanel extends Component {
  constructor() {
    super();
    this.state = { value: '',
      file: {},
      errorMessage: '',
      csvData: [],
      enrolledStudents: [],
      unenrolledStudents: [],
      currentSearched: '',
    };
    this.changeInput = this.changeInput.bind(this);
    this.importCSV = this.importCSV.bind(this);
    this.parseFile = this.parseFile.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentWillMount() {
    this.setState({
      loadingSearch: this.props.loadingSearch,
      enrolledStudents: this.props.students,
      filteredALl: this.props.filteredAllStudents,
      unenrolledStudents: this.getUnenrolledStudents(this.props.filteredAllStudents),
    });
  }
  componentWillReceiveProps(nextProps) {
//    console.log('ENROLED: ', nextProps.students);
//    console.log('UNENROLED', nextProps.filteredAllStudents);
//    console.log('UNENROLLED', this.getUnenrolledStudents(nextProps.filteredAllStudents));
    this.setState({
      loadingSearch: nextProps.loadingSearch,
      enrolledStudents: nextProps.students,
      filteredALl: nextProps.filteredAllStudents,
      unenrolledStudents: this.getUnenrolledStudents(nextProps.filteredAllStudents),
    });
  }
  getUnenrolledStudents(allStudents) {
    const newStudentsObj = {};
    this.props.students.map((obj) => {
      newStudentsObj[obj.id] = obj.name;
      return 0;
    });
    return allStudents.filter((obj) => {
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

  addStudent(id) {
//    console.log(id);
//    console.log('ADD', this.state.unenrolledStudents);
    let newIndex = -1;
    this.state.unenrolledStudents.map((item, index) => {
      if (item.id === id) {
        newIndex = index;
      }
      return (-1);
    });
    if (newIndex >= 0) {
      const newEnrolledObj = this.state.enrolledStudents;
      newEnrolledObj.push(this.state.unenrolledStudents[newIndex]);

      const newUnenrolledObj = this.state.unenrolledStudents;
      newUnenrolledObj.splice(newIndex, 1);

      this.setState({
        enrolledStudents: newEnrolledObj,
        unenrolledStudents: newUnenrolledObj,
      });
      this.props.forceFilter(this.state.currentSearched);
    }
  }
  removeStudent(id) {
    let newIndex = -1;
    this.state.enrolledStudents.map((item, index) => {
      if (item.id === id) {
        newIndex = index;
      }
      return (-1);
    });
    if (newIndex >= 0) {
      const newUnenrolledObj = this.state.unenrolledStudents;
      newUnenrolledObj.push(this.state.enrolledStudents[newIndex]);

      const newEnrolledObj = this.state.enrolledStudents;
      newEnrolledObj.splice(newIndex, 1);
      this.setState({
        enrolledStudents: newEnrolledObj,
        unenrolledStudents: newUnenrolledObj,
      });
      this.props.forceFilter(this.state.currentSearched);
    }
  }
  handleSearch(event) {
    this.props.manageSearch(event.target.value);
    this.setState({ currentSearched: event.target.value });
  }
  renderEnrolledStudents() {
    if (this.state.loadingSearch === true) {
      return <SearchSpinner />;
    } else if (this.state.loadingSearch === false) {
      if (this.props.students.length === 0) {
        return <h4>There are no students enrolled in this class!</h4>;
      } else if (this.props.filteredStudents.length === 0) {
        return <h4>No enrolled students found!</h4>;
      }
      return this.props.filteredStudents.map((obj, index) =>
        <li key={`enrolled_student_${obj.id}`}>
          <StudentManager
            type={'remove'}
            id={obj.id}
            index={index}
            name={obj.name}
            removeStudent={() => this.removeStudent(obj.id)}
          />
        </li>,
    );
    }
    return (null);
  }

  renderUnenrolledStudents() {
    if (this.state.loadingSearch === true) {
      return <SearchSpinner />;
    } else if (this.state.loadingSearch === false) {
      if (this.state.currentSearched.length === 0) {
        return (null);
      }
      if (this.state.unenrolledStudents.length === 0 && this.state.currentSearched.length > 0) {
        return <h4>No unenrolled students found!</h4>;
      }
      return this.state.unenrolledStudents.map((obj, index) =>
        <li key={`unenrolled_student_${obj.id}`}>
          <StudentManager
            type={'add'}
            id={obj.id}
            index={index}
            name={obj.name}
            addStudent={() => this.addStudent(obj.id)}
          />
        </li>,
      );
    }
    return (null);
  }
  renderSearchBar() {
    return (
      <NavItem key={'searchBar'} >
        <input
          className="searchBarItem"
          id="searchBar"
          type="text"
          placeholder="Search for a student"
          onChange={this.handleSearch}
        />
      </NavItem>
    );
  }
  render() {
    return (
      <div className="studentsPanelWrapper">
        <Col md={12}>
          <h3>Manage enrolled Students</h3>
          {this.renderSearchBar()}
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
          <Button
            onClick={() =>
              this.props.handleSaveEnrolledStudents(this.state.enrolledStudents)}
          > Save </Button>
          <hr />
        </Col>

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
      </div>
    );
  }
}

StudentsPanel.propTypes = {
  students: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  filteredAllStudents: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleSaveEnrolledStudents: PropTypes.func.isRequired,
  manageSearch: PropTypes.func.isRequired,
  forceFilter: PropTypes.func.isRequired,
  filteredStudents: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  loadingSearch: PropTypes.bool.isRequired,
};
