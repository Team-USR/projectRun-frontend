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
  ClassSearchPanel,
} from './panels';
import { LineCh } from '../Charts';

let timeout = null;
let classesTimeout = null;
/*
  My Classes Panel component
*/
export default class MyClassesPanel extends Component {
  constructor() {
    super();
    this.state = {
      filteredStudents: [],
      filteredAllStudents: [],
      pendingClasssesRequests: [],
      sentClasses: [],
      searchedClasses: [],
      loadingClassesSearch: false,
      loadingSearch: false,
      moveToPendingError: false,
      highestMarks: [],
    };
  }
  /*
    Retrieveing the class marks  and setting the local state to contain the mark data.
  */
  async componentWillMount() {
    if (this.props.classId.length > 0 && this.props.userType === STUDENT) {
      const data = await this.props.getClassMarks(this.props.classId);
      this.setState({
        highestMarks: data,
      });
    }
    this.setState({
      filteredStudents: this.props.content.students,
      filteredAllStudents: this.props.allStudents,
    });
  }
  /*
   When new data is received the new class marks is being updated
  */
  async componentWillReceiveProps(nextProps) {
    if (this.props.classId.length > 0 && this.props.userType === STUDENT) {
      const data = await this.props.getClassMarks(this.props.classId);
      this.setState({
        highestMarks: data,
      });
    }
    this.setState({
      filteredStudents: nextProps.content.students,
      filteredAllStudents: nextProps.allStudents,
    });
  }
  /*
  Search function for the classes. Filters all the classes and displays the most
  relevant.
  */
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
  /*
  Makes a request to search for a user after a certain amount of time after the
  user stops writting in the serach bar. The results will be shown on the panel
  in an order from the most relevant to the least relevant by name and by email.
  */
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
  /*
    After a request is made the class is moved to the pending list
  */
  moveToRequests(item) {
    const pendingList = this.state.pendingClasssesRequests;
    let duplicate = false;
    this.setState({ moveToPendingError: false });
    if (pendingList !== undefined && pendingList !== null && pendingList.length !== 0) {
      pendingList.map((existingItem) => {
        if (existingItem.id === item.id) {
          duplicate = true;
          this.setState({ moveToPendingError: true });
        }
        return 0;
      });
    }
    if (duplicate === false) {
      pendingList.push(item);
      this.setState({ pendingClasssesRequests: pendingList, moveToPendingError: false });
    }
  }
  /*
  Makes a post request in order for the student to send a join request into
  a class.
  */
  sendInvitation(classId) {
    axios({
      url: `${API_URL}/groups/${classId}/request_join`,
      method: 'post',
      headers: this.props.userToken,
    })
    .then(() => {
      const sent = this.state.sentClasses;
      sent.push(classId);
      this.setState({ sentClasses: sent });
    });
  }
  /*
    Makes a request to search for a class in order to request an invitation.
    The request is made after a certain amount of time after the user stops
    writting in the search bar.
    @param className {String} [class name]
  */
  searchClassForInvite(className) {
    if (classesTimeout !== null) {
      clearTimeout(classesTimeout);
    }
    if (className.length > 0) {
      this.setState({ loadingClassesSearch: true });
      classesTimeout = setTimeout(() => {
        const searchedItem = { input: className };
        axios({
          url: `${API_URL}/groups/search`,
          headers: this.props.userToken,
          method: 'post',
          data: searchedItem,
        })
      .then((response) => {
        const retrievedClasses = [];
        let best = {};
        if (response.data.best_match_name[0]) {
          best = {
            id: response.data.best_match_name[0].id,
            name: response.data.best_match_name[0].name,
          };
          retrievedClasses.push(best);
        }
        response.data.alternative_match_name.map((item) => {
          let duplicate = false;
          retrievedClasses.map((duplicateItem) => {
            if (item.id === duplicateItem.id) {
              duplicate = true;
            }
            return 0;
          });
          if (!duplicate) {
            const objName = { id: item.id, name: item.name };
            retrievedClasses.push(objName);
          }
          return 0;
        });
        this.setState({ searchedClasses: retrievedClasses });
      });
        this.setState({
          loadingClassesSearch: false,
        });
      }, 2000);
    }
    if (className.length === 0) {
      this.setState({ loadingClassesSearch: false });
    }
  }
  /*
  Renders the DefaultClassesPanel component and send's it
  it's props
  */
  renderPanel() {
    let element = (
      <DefaultClassesPanel
        handleSideBarClassClick={(currentClassId, classTitle) =>
        this.props.handleSideBarClassClick(currentClassId, classTitle)}
        classes={this.props.classes}
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
              classId={this.props.classId}
              userToken={this.props.userToken}
              handleSaveEnrolledStudents={newStudentsArray =>
                this.props.handleSaveEnrolledStudents(newStudentsArray)}
              students={this.props.content.students}
              filteredStudents={this.state.filteredStudents}
              allStudents={this.props.allStudents}
              filteredAllStudents={this.state.filteredAllStudents}
              manageSearch={value => this.manageSearch(value)}
              forceFilter={value => this.filterItems(value)}
              loadingSearch={this.state.loadingSearch}
              requestsList={this.props.requestsList}
              invitedList={this.props.invitedList}
              refreshStudents={(classId, panelType) =>
                this.props.refreshStudents(classId, panelType)}
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
              </Col>
              <Col md={6}>
                <GroupStudents
                  userType={this.props.userType}
                  students={this.props.content.students}
                  handleManageStudentsFromClass={() => this.props.handleManageStudentsFromClass()}
                />
              </Col>
            </Col>
            <Button
              className="red_button"
              onClick={() =>
              this.props.handleDeleteClass(this.props.classId)}
            >
              Delete Class
            </Button>
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
      if (this.props.panelType === 'show_selected_class') {
        element = (
          <div>
            { classTitle }
            <GroupQuizzes
              userType={this.props.userType}
              quizzes={this.props.content.quizzes}
            />
            <hr />
            {this.state.highestMarks.length > 0 ?
              (<div className="line-chart-container">
                <LineCh
                  color="grey"
                  data={this.state.highestMarks.reduce((acc, quiz) => {
                    const validQuizzes = acc;
                    if (quiz.marks.quiz_name) {
                      validQuizzes.push({
                        name: quiz.marks.quiz_name,
                        value: quiz.marks.score,
                      });
                    }
                    return validQuizzes;
                  }, [])}
                />
              </div>)
              : <h3>You have no submitted quiz for this class.</h3>}
          </div>
        );
      } else if (this.props.panelType === 'show_search_class_panel') {
        element = (
          <div>
            <ClassSearchPanel
              pendingClasssesRequests={this.state.pendingClasssesRequests}
              searchedClasses={this.state.searchedClasses}
              searchClassForInvite={className => this.searchClassForInvite(className)}
              loadingClassesSearch={this.state.loadingClassesSearch}
              moveToPendingError={this.state.moveToPendingError}
              moveToRequests={item => this.moveToRequests(item)}
              sendInvitation={id => this.sendInvitation(id)}
              sentClasses={this.state.sentClasses}
              userToken={this.props.userToken}
            />
          </div>
        );
      }
    }
    return element;
  }
  /*
  Main render method.
  */
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
  getClassMarks: PropTypes.func.isRequired, // eslint-disable-line
  handleSaveNewClassClick: PropTypes.func.isRequired,
  handleSaveAssignedQuizzes: PropTypes.func.isRequired,
  handleSaveEnrolledStudents: PropTypes.func.isRequired,
  handleManageQuizzesFromClass: PropTypes.func.isRequired,
  handleManageStudentsFromClass: PropTypes.func.isRequired,
  handleDeleteClass: PropTypes.func.isRequired,
  userToken: React.PropTypes.shape({}).isRequired,
  updateAllStudents: React.PropTypes.func.isRequired,
  requestsList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  refreshStudents: PropTypes.func.isRequired,
  invitedList: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleSideBarClassClick: PropTypes.func.isRequired,
  classes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

MyClassesPanel.defaultProps = {
  averagePerCreatedClass: [],
};
