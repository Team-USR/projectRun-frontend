import Papa from 'papaparse';
import React, { PropTypes, Component } from 'react';
import axios from 'axios';
import { Button, Col, NavItem, Tabs, Tab, Clearfix } from 'react-bootstrap';
import { StudentManager } from '../GroupStudents';
import { SearchSpinner } from '../../../components/utils';
import { API_URL } from '../../../constants';

export default class StudentsPanel extends Component {
  constructor() {
    super();
    this.state = { value: '',
      file: {},
      errorMessage: '',
      csvData: [],
      csvRows: [],
      enrolledStudents: [],
      unenrolledStudents: [],
      currentSearched: '',
      userToken: null,
      studentInviteMessage: '',
      studentsInvited: [],
      send: false,
      showSpecial: false,
      showContainer: false,
      loadedMessage: '',
    };
    this.changeInput = this.changeInput.bind(this);
    this.importCSV = this.importCSV.bind(this);
    this.parseFile = this.parseFile.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.sendInvite = this.sendInvite.bind(this);
    this.inviteStudents = this.inviteStudents.bind(this);
  }

  componentWillMount() {
    this.setState({
      loadingSearch: this.props.loadingSearch,
      enrolledStudents: this.props.students,
      filteredALl: this.props.filteredAllStudents,
      unenrolledStudents: this.getUnenrolledStudents(this.props.filteredAllStudents),
      requestsList: this.props.requestsList,
      userToken: this.props.userToken,
      studentsInvited: this.props.invitedList,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      loadingSearch: nextProps.loadingSearch,
      enrolledStudents: nextProps.students,
      filteredALl: nextProps.filteredAllStudents,
      unenrolledStudents: this.getUnenrolledStudents(nextProps.filteredAllStudents),
      requestsList: nextProps.requestsList,
      studentsInvited: nextProps.invitedList,
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
    this.setState({ csvData: [], showSpecial: false, showContainer: false });
    let fileToParse = this.csv.files[0];
    if (fileToParse === undefined) {
      fileToParse = {};
      this.setState({ csvData: [] });
    }
    this.setState({ file: fileToParse, errorMessage: '', loadedMessage: '' });
    // console.log(fileToParse);
  }

  parseFile() {
    this.setState({ showSpecial: false });
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
        const partialArray = [];
        results.data.map((object, index) => {
          if (object.email !== undefined) {
            emptyArray.push(object.email.replace(/\s+/g, ''));
            if (index < 10) {
              partialArray.push(object.email.replace(/\s+/g, ''));
            }
          }
          return ('');
        },
        );
        this.setState({
          csvData: emptyArray,
          send: true,
          showContainer: true,
        });
      },
    });
  }

  showCsvData() {
    const emptyArray = [];
    if (!this.state.showSpecial) {
      this.state.csvData.map((email, index) => {
        const ind = index;
        emptyArray.push(
          <div key={`student_email_${ind}`} className="invited cardSection_inv2">
            <div>{email}</div>
          </div>,
        );
        return ('');
      });
      return emptyArray;
    }
    const toReturn = this.state.csvRows;
    return toReturn;
  }

  showLabel() {
    if (this.state.csvData.length !== 0) {
      return (<h4> Retrieved students from file:</h4>);
    }
    return ('');
  }

  showAddButton() {
    if (this.state.csvData.length !== 0 && this.state.send) {
      return (<Col md={12} className="invite_students">
        <Button onClick={this.inviteStudents}> Invite students </Button></Col>);
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

  approveStudent(object) {
    const sendObject = { email: object.email };
    axios({
      url: `${API_URL}/groups/${this.props.classId}/accept_join`,
      method: 'post',
      data: sendObject,
      headers: this.state.userToken,
    })
    .then(() => {
      const requests = this.state.requestsList;
    //  const newEnrolledObj = this.state.enrolledStudents;
      this.state.requestsList.map((item, index) => {
        if (item.id === object.id) {
          requests.splice(index, 1);
        //  newEnrolledObj.push(this.state.requestsList[index]);
        }
        return 0;
      });
      this.setState({
        requestsList: requests,
      //  enrolledStudents: newEnrolledObj
      });
      this.props.refreshStudents(this.props.classId, 'manage_studens_panel');
    });
  }

  declineStudents(object) {
    const sendObject = { email: object.email };
    axios({
      url: `${API_URL}/groups/${this.props.classId}/decline_join`,
      method: 'post',
      data: sendObject,
      headers: this.state.userToken,
    })
    .then(() => {
      const requests = this.state.requestsList;
    //  const newEnrolledObj = this.state.enrolledStudents;
      this.state.requestsList.map((item, index) => {
        if (item.id === object.id) {
          requests.splice(index, 1);
        //  newEnrolledObj.push(this.state.requestsList[index]);
        }
        return 0;
      });
      this.setState({
        requestsList: requests,
      //  enrolledStudents: newEnrolledObj
      });
      this.props.refreshStudents(this.props.classId, 'manage_studens_panel');
    });
  }

  handleSearch(event) {
    this.props.manageSearch(event.target.value);
    this.setState({ currentSearched: event.target.value });
  }

  sendInvite() {
    const inputValue = this.state.value;
    const myObject = { users: [inputValue] };
    axios({
      url: `${API_URL}/groups/${this.props.classId}/add_users`,
      headers: this.props.userToken,
      method: 'post',
      data: myObject,
    })
    .then((response) => {
      if (response.status === 200 && response.statusText === 'OK') {
        if (response.data[0].status === 'added') {
          this.setState({ studentInviteMessage: `${response.data[0].email} has been added to this class!` });
        } else {
          this.setState({ studentInviteMessage: `${response.data[0].email} has been invited to join this class!` });
        }
      }
    });
    this.props.refreshStudents(this.props.classId, 'manage_studens_panel');
  }

  inviteStudents() {
    const userEmails = this.state.csvData;
    const myObject = { users: userEmails };
    const added = [];
    const partial = [];
    axios({
      url: `${API_URL}/groups/${this.props.classId}/add_users`,
      headers: this.props.userToken,
      method: 'post',
      data: myObject,
    })
    .then((response) => {
      if (response.status === 200 && response.statusText === 'OK') {
        for (let i = 0; i < response.data.length; i += 1) {
          if (response.data[i].status === 'added') {
            added.push(<div key={`email_${i}`} className="invited">
              <div><span
                className="ok_sign glyphicon glyphicon-ok"
                title="User has been added!"
              />{response.data[i].email}
              </div></div>);
          } else {
            added.push(<div key={`email_${i}`} className="invited">
              <div><span
                className="env_sign glyphicon glyphicon-envelope"
                title="User has been invited!"
              />{response.data[i].email}
              </div></div>);
          }
        }
      }
      for (let i = 0; i < 10; i += 1) {
        if (added[i] !== undefined) {
          partial.push(added[i]);
        }
      }
      this.setState({
        csvRows: added,
        send: false,
        showSpecial: true,
        loadedMessage: 'Students have been added/invited. The invitations list will update shortly!',
      });
    });
    this.props.refreshStudents(this.props.classId, 'manage_studens_panel');
  }

  renderInvitedStudents() {
    const arrayToRet = [];
    this.state.studentsInvited.map((element, index) => {
      const ind = index;
      arrayToRet.push(<div key={`invited_${ind}`} className="invited cardSection_inv2">{element}</div>);
      return '';
    });
    return arrayToRet;
  }

  renderStudentInvite() {
    return (<h4 className="invite_message">{this.state.studentInviteMessage}</h4>);
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

  renderSearchStudent() {
    return (
      <div>
        {this.renderSearchBar()}
        <Col md={12} className="studentsList">
          <Col md={6} key={'renderSearchStudent'}>
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
            className="enjoy-css"
            onClick={() =>
            this.props.handleSaveEnrolledStudents(this.state.enrolledStudents)}
          >
            Save
          </Button>
          <hr />
        </Col>
      </div>
    );
  }

  renderInviteStudent() {
    return (
      <div className="main_container">
        <div className="form_container">
          <div className="inside">
            <h4 className="header_title">Enter email to invite student to class:</h4>
            <div className="input_container">
              <input
                className="student_input"
                value={this.state.value}
                size={30}
                placeholder="Student email" onChange={this.changeInput}
              />
              <Button onClick={this.sendInvite} >Invite student</Button>
            </div>
            {this.renderStudentInvite()}
          </div>
        </div>
        {(this.state.studentsInvited.length !== 0) &&
          (<div className="invited_container cardSection_inv">
            <div className="invited_inside">
              <div className="invited_margin">
                {this.renderInvitedStudents()}
                <Clearfix />
              </div>
            </div>
          </div>)}
      </div>
    );
  }

  renderRequestsPanel() {
    return (
      <div key={'manageRequests'}>
        <Col md={12}>
          {
          this.state.requestsList.map(item =>
            (
              <Col md={4} key={`student${item.id}`}>
                <div className="requestStudentGroup">
                  <Col md={12}>
                    <Col md={8} sm={9}>
                      <Button
                        className="requestStudentName"
                        onClick={() => null}
                      >
                        {item.name}
                      </Button>
                    </Col>
                    <Col md={4} sm={3} className="respondButtons">
                      <Button
                        className="decline"
                        onClick={() => this.declineStudents(item)}
                      >
                        <span className="glyphicon glyphicon-remove" style={{ color: '#d10c0f' }} />
                      </Button>
                      <Button
                        className="accept"
                        onClick={() => this.approveStudent(item)}
                      >
                        <span className="glyphicon glyphicon-ok" style={{ color: '#2ed146' }} />
                      </Button>
                    </Col>
                  </Col>
                </div>
              </Col>
            ),
          )
        }
        </Col>
      </div>
    );
  }

  renderImportStudents() {
    let myStyle;
    if (this.state.showContainer) {
      myStyle = {
        display: 'inline-block',
      };
    } else {
      myStyle = {
        display: 'none',
      };
    }
    return (
      <div className="main_container">
        <div className="form_container">
          <div className="inside">
            <h4 className="header_title">Select a .csv file to retrieve the emails.</h4>
            <div className="input_container">
              <input
                type="file"
                ref={(csvfile) => { this.csv = csvfile; }}
                accept=".csv" onChange={this.importCSV}
              />
              <Button onClick={this.parseFile}>Read file</Button>
              <p style={{ color: '#d10c0f' }}>{this.state.errorMessage}</p>
            </div>

          </div>
          {this.showLabel()}
          <div className="invited_containerCSV cardSection_inv" style={myStyle}>
            <div className="invited_inside">
              <div className="invited_margin">
                {this.showCsvData()}
                <Clearfix />
              </div>
            </div>
          </div>
          {this.showAddButton()}
          <h4 className="confirmation_message">{this.state.loadedMessage}</h4>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="studentsPanelWrapper">
        <Tabs defaultActiveKey={0} id="uncontrolled-tab-example" className="tabsWrapper">
          <Tab eventKey={0} title="Manage enrolled students">
            {this.renderSearchStudent() }
          </Tab>
          <Tab eventKey={1} title="Approve requests">
            {this.renderRequestsPanel() }
          </Tab>
          <Tab eventKey={2} title="Invite students">
            { this.renderInviteStudent() }
          </Tab>
          <Tab eventKey={3} title="Import students">
            { this.renderImportStudents() }
          </Tab>
        </Tabs>
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
  requestsList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  userToken: PropTypes.shape({}).isRequired,
  classId: PropTypes.string.isRequired,
  refreshStudents: PropTypes.func.isRequired,
  invitedList: PropTypes.arrayOf(PropTypes.string).isRequired,
};
