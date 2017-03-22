import React, { PropTypes, Component } from 'react';
import axios from 'axios';
import { Button, Col } from 'react-bootstrap';
import { GroupQuizzes } from './GroupQuizzes';
import { GroupStudents } from './GroupStudents';
import { STUDENT, TEACHER, API_URL } from '../../constants';
import {
  StudentsPanel,
  QuizzesPanel,
  DefaultClassesPanel,
  CreateClassPanel,
} from './panels';
import { LineCh } from '../Charts';

let timeout = null;
export default class MyClassesPanel extends Component {
  constructor() {
    super();
    this.state = {
      filteredStudents: [],
      filteredAllStudents: [],
      loadingSearch: false,
    };
  }
  componentWillMount() {
    this.setState({
      filteredStudents: this.props.content.students,
      filteredAllStudents: this.props.allStudents,
    });
  }
  componentWillReceiveProps(nextProps) {
//    console.log("RECEIVE PROPS");
    this.setState({
      filteredStudents: nextProps.content.students,
      filteredAllStudents: nextProps.allStudents,
    });
  }
  filterItems(value) {
    let found = false;
    let filtered = this.props.content.students.filter((item) => {
      if (item.name.toLowerCase() === value.toLowerCase() ||
          item.name.toLowerCase().includes(value.toLowerCase())) {
        found = true;
        return (item);
      }
      return (null);
    });
    if (!found && value !== '') {
      filtered = [];
    } else
    if (filtered.length === 0 || value === '') {
      filtered = this.props.content.students;
    }
    let filteredAll = this.props.allStudents.filter((item) => {
      if (item.name.toLowerCase() === value.toLowerCase() ||
          item.name.toLowerCase().includes(value.toLowerCase())) {
        found = true;
        return (item);
      }
      return (null);
    });
    if (!found && value !== '') {
      filteredAll = [];
    } else
    if (filteredAll.length === 0 || value === '') {
      filteredAll = this.props.allStudents;
    }
    this.setState({
      filteredStudents: filtered,
      filteredAllStudents: filteredAll });
  }
  manageSearch(value) {
    this.filterItems(value);
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    if (value.length > 0) {
      this.setState({ loadingSearch: true });
      timeout = setTimeout(() => {
        const searchedItem = { input: value };
        axios({
          url: `${API_URL}/users/search`,
          headers: this.props.userToken,
          method: 'post',
          data: searchedItem,
        })
      .then((response) => {
//        console.log(response);
        const retrievedStudents = [];
        let best = {};
        if (response.data.best_match_name[0]) {
          best = {
            id: response.data.best_match_name[0].id,
            name: response.data.best_match_name[0].name,
            email: response.data.best_match_name[0].email,
          };
          retrievedStudents.push(best);
        }
        let best2 = {};
        if (response.data.best_match_email[0]) {
          best2 = {
            id: response.data.best_match_email[0].id,
            name: response.data.best_match_email[0].name,
            email: response.data.best_match_email[0].email,
          };
          if (retrievedStudents[0].id !== response.data.best_match_email[0].id) {
            retrievedStudents.push(best2);
          }
        }
        response.data.alternative_match_name.map((item) => {
          let duplicate = false;
          retrievedStudents.map((duplicateItem) => {
            if (item.id === duplicateItem.id) {
              duplicate = true;
            }
            return 0;
          });
          if (!duplicate) {
            const objName = { id: item.id, name: item.name, email: item.email };
            retrievedStudents.push(objName);
          }
          return 0;
        });
        response.data.alternative_match_email.map((item) => {
          let duplicate = false;
          retrievedStudents.map((duplicateItem) => {
            if (item.id === duplicateItem.id) {
              duplicate = true;
            }
            return 0;
          });
          if (!duplicate) {
            const objEmail = { id: item.id, name: item.name, email: item.email };
            retrievedStudents.push(objEmail);
          }
          return 0;
        });
        this.props.updateAllStudents(retrievedStudents);
        this.filterItems(value);
      });
        this.setState({
          loadingSearch: false,
        });
      }, 2000);
    }
    if (value.length === 0) {
      this.setState({ loadingSearch: false });
    }
  }
  renderPanel() {
    let element = (
      <DefaultClassesPanel
        userType={this.props.userType}
        numberOfClasses={this.props.numberOfClasses}
        averagePerCreatedClass={this.props.averagePerCreatedClass}
      />
    );
    const classTitle = (
      <div>
        <h2><b>{this.props.classTitle}</b></h2>
        <hr />
      </div>
    );
    if (this.props.userType === TEACHER) {
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
              handleSaveEnrolledStudents={newStudentsArray =>
                this.props.handleSaveEnrolledStudents(newStudentsArray)}
              students={this.props.content.students}
              filteredStudents={this.state.filteredStudents}
              allStudents={this.props.allStudents}
              filteredAllStudents={this.state.filteredAllStudents}
              manageSearch={value => this.manageSearch(value)}
              forceFilter={value => this.filterItems(value)}
              loadingSearch={this.state.loadingSearch}
            />
          </div>
        );
      }

      if (this.props.panelType === 'show_selected_class') {
        element = (
          <div>
            { classTitle }
            <Col md={12}>
              <Col md={6}>
                <GroupQuizzes
                  userType={this.props.userType}
                  quizzes={this.props.content.quizzes}
                  handleManageQuizzesFromClass={() => this.props.handleManageQuizzesFromClass()}
                />
                <hr />
              </Col>
              <Col md={6}>
                <GroupStudents
                  userType={this.props.userType}
                  students={this.props.content.students}
                  handleManageStudentsFromClass={() => this.props.handleManageStudentsFromClass()}
                />
                <hr />
              </Col>
            </Col>
            <Button
              className="deleteButton"
              onClick={() =>
              this.props.handleDeleteClass(this.props.classId)}
            >Delete Class</Button>
          </div>
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
    } else if (this.props.userType === STUDENT) {
      const data = this.props.marksPerQuizPerClass.filter(myClass =>
        myClass.className !== classTitle);
      if (this.props.panelType === 'show_selected_class') {
        element = (
          <div>
            { classTitle }
            <GroupQuizzes
              userType={this.props.userType}
              quizzes={this.props.content.quizzes}
            />
            <hr />
            <LineCh
              data={data[0].marks}
              placeholder="You have no submitted quizzes."
            />
          </div>
        );
      }
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
  userType: PropTypes.string.isRequired,
  classId: PropTypes.string.isRequired,
  classTitle: PropTypes.string.isRequired,
  panelType: PropTypes.string.isRequired,
  content: PropTypes.shape({
    quizzes: PropTypes.arrayOf(PropTypes.shape({})),
    students: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  allQuizzes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  allStudents: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  numberOfClasses: PropTypes.number.isRequired,
  averagePerCreatedClass: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.number,
  })),
  marksPerQuizPerClass: PropTypes.arrayOf(PropTypes.shape({
    className: PropTypes.string,
    marks: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
    })),
  })),
  handleSaveNewClassClick: PropTypes.func.isRequired,
  handleSaveAssignedQuizzes: PropTypes.func.isRequired,
  handleSaveEnrolledStudents: PropTypes.func.isRequired,
  handleManageQuizzesFromClass: PropTypes.func.isRequired,
  handleManageStudentsFromClass: PropTypes.func.isRequired,
  handleDeleteClass: PropTypes.func.isRequired,
  userToken: React.PropTypes.shape({}).isRequired,
  updateAllStudents: React.PropTypes.func.isRequired,
};

MyClassesPanel.defaultProps = {
  averagePerCreatedClass: [],
  marksPerQuizPerClass: [],
};
