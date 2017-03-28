import React, { PropTypes, Component } from 'react';
import cookie from 'react-cookie';
import axios from 'axios';
import { API_URL, STUDENT, TEACHER } from '../../constants';
import { SideBarWrapper } from '../SideBar';
import { MyClassesPanel } from './index';
import { BrandSpinner, ModalError } from '../utils';

import { formatAveragePerCreatedClass } from '../../helpers';
/**
*  Main component that handles most of the logic from the My classes Page
*/
export default class MyClassesPage extends Component {
/**
* Main constructor where the state is initialized
* @props
*/
  constructor(props) {
    super(props);

    this.state = {
      panelType: 'my_classes_default_panel',
      averagePerCreatedClass: [],
      loadingSideBar: true,
      allClasses: [],
      currentClassTitle: '',
      currentClassId: '',
      allQuizzes: [],
      allStudents: [
        // { id: 9, name: 'Geon' },
        // { id: 10, name: 'Gigel' },
        // { id: 11, name: 'Jlaba' },
        // { id: 12, name: 'Blercu' },
      ],
      requestsList: [],
      invitedList: [],
      sideBarContent: { classes: [] },
      content: { quizzes: [], students: [] },
      userT: STUDENT,
      loading: false,

      showModal: false,
      modalContent: {
        header: 'Error!',
        body: 'The Quiz contains errors',
        buttons: ['close'],
        modalProps: {},
      },
    };
  }
  /*
  After mounting the component according to the user type there will be called
  different functions to request the data needed to render the page. (Student/Teacher)
  */
  componentWillMount() {
    const settingUserType = cookie.load('userType');
    if (settingUserType) {
      if (settingUserType === TEACHER) {
        this.requestTeacherData();
        this.requestTeacherStatistics();
      }
      if (settingUserType === STUDENT) {
        this.requestStudentData();
      }
      this.setState({ userT: settingUserType });
    } else {
      this.requestStudentData();
    }
  }
  /*
  Makes a request to retrieve all the quizzes from a class
  given the class id.
  After the first request is made, a new request retrieving all the sudents,
  pending requests and invitations regarding a class
  @param currentClassId {Number} [the id of the class as it is in the backend]
  */
  getClassContent(currentClassId) {
    this.setState({ loading: true });
    axios({
      url: `${API_URL}/groups/${currentClassId}/quizzes`,
      headers: this.props.userToken,
    })
    .then((response) => {
      const newContent = this.state.content;
      newContent.quizzes = response.data;

      if (this.state.userT === TEACHER) {
        axios({
          url: `${API_URL}/groups/${currentClassId}/edit`,
          headers: this.props.userToken,
        })
        .then((studentsResponse) => {
          newContent.students = studentsResponse.data.students;
          this.setState({
            panelType: 'show_selected_class',
            content: newContent,
            requestsList: studentsResponse.data.pending_requests_users,
            invitedList: studentsResponse.data.pending_invite_users,
          });
          setTimeout(() => {
            this.setState({
              loading: false,
            });
          }, 510);
        })
        .catch(() => {
          this.setState({ panelType: 'my_classes_default_panel' });
          setTimeout(() => {
            this.setState({
              loading: false,
            });
          }, 510);
        });
      } else if (this.state.userT === STUDENT) {
        this.setState({ panelType: 'show_selected_class', content: newContent });
        setTimeout(() => {
          this.setState({
            loading: false,
          });
        }, 510);
      }
    })
    .catch(() => {
      cookie.remove('current-class-id');
      cookie.remove('current-class-title');
      this.setState({ panelType: 'my_classes_default_panel' });
      setTimeout(() => {
        this.setState({
          loading: false,
        });
      }, 510);
    });
  }
  /*
    Functions that refreshes the student lists by making a new request.
    This happens after a certain action (ex: remove/add quiz/student) has
    taken place so the lists/sidebar needs to be refreshed
    @param currentClassId {Number}
    @param ptyp {String} [a string representing the panel type that
    needs to be displayed after the refresh]
  */
  refreshStudents(currentClassId, ptyp) {
    axios({
      url: `${API_URL}/groups/${currentClassId}/quizzes`,
      headers: this.props.userToken,
    })
    .then((response) => {
      const newContent = this.state.content;
      newContent.quizzes = response.data;

      if (this.state.userT === TEACHER) {
        axios({
          url: `${API_URL}/groups/${currentClassId}/edit`,
          headers: this.props.userToken,
        })
        .then((studentsResponse) => {
          newContent.students = studentsResponse.data.students;
          this.setState({
            panelType: ptyp,
            content: newContent,
            requestsList: studentsResponse.data.pending_requests_users,
            invitedList: studentsResponse.data.pending_invite_users,
          });
        });
      } else if (this.state.userT === STUDENT) {
        this.setState({ panelType: ptyp, content: newContent });
      }
    })
    .catch(() => {
      this.setState({ panelType: 'my_classes_default_panel' });
    });
  }
  /*
    Updates the student state with a new object
  */
  updateAllStudents(object) {
    this.setState({ allStudents: object });
  }
  /*
  Close the modal
  */
  closeModal() {
    this.setState({ showModal: false });
  }
  /*
  Opens the modal
  @param content
  */
  openModal(content) {
    if (content) {
      this.setState({ showModal: true, modalContent: content });
    } else {
      this.setState({ showModal: true });
    }
  }
  /*
  Makes a request to get the groups created by a teacher and then
  a new request to retrieve all the quizzes created by a teacher
  */
  requestTeacherData() {
    axios({
      url: `${API_URL}/users/mine/groups`,
      headers: this.props.userToken,
    })
    .then((response) => {
      axios({
        url: `${API_URL}/quizzes/mine`,
        headers: this.props.userToken,
      })
      .then((quizzesResponse) => {
        this.setState({ allQuizzes: quizzesResponse.data });
      })
      .catch(() => {
        this.setState({ panelType: 'my_classes_default_panel' });
      });

      const newSideBarContent = { classes: response.data.filter(obj => obj.role === 'admin').reverse() };
      const cookieClassId = cookie.load('current-class-id');
      const cookieClassTitle = cookie.load('current-class-title');

      if (cookieClassId != null && cookieClassTitle != null) {
        this.getClassContent(cookieClassId);

        setTimeout(() => {
          this.setState({
            currentClassId: cookieClassId,
            currentClassTitle: cookieClassTitle,
            sideBarContent: newSideBarContent,
            loadingSideBar: false,
          });
        }, 1200);
      } else {
        setTimeout(() => {
          this.setState({
            panelType: 'my_classes_default_panel',
            sideBarContent: newSideBarContent,
            loadingSideBar: false,
          });
        }, 1200);
      }
    });
  }
  /*
  Makes a request to retrieve the avarage marks from all groups created by a teacher
  */
  requestTeacherStatistics() {
    axios({
      url: `${API_URL}/statistics/average_marks_groups`,
      headers: this.props.userToken,
    }).then((response) => {
      this.setState({
        averagePerCreatedClass: response.data,
      });
    });
  }
  /*
    Makes a request to retrieve all the groups in which a Student is enrolled in
  */
  requestStudentData() {
    axios({
      url: `${API_URL}/users/mine/groups`,
      headers: this.props.userToken,
    })
    .then((response) => {
      const newSideBarContent = { classes: response.data.filter(obj => obj.role === 'student').reverse() };
      const cookieClassId = cookie.load('current-class-id');
      const cookieClassTitle = cookie.load('current-class-title');

      if (cookieClassId != null && cookieClassTitle != null) {
        const classId = cookie.load('current-class-id');
        const classTitle = cookie.load('current-class-title');
        this.getClassContent(classId);

        setTimeout(() => {
          this.setState({
            currentClassId: classId,
            currentClassTitle: classTitle,
            sideBarContent: newSideBarContent,
            loadingSideBar: false,
          });
        }, 1200);
      } else {
        setTimeout(() => {
          this.setState({
            panelType: 'my_classes_default_panel',
            sideBarContent: newSideBarContent,
            loadingSideBar: false,
          });
        }, 1200);
      }
    });
  }
  /*
    Makes a request to retrieve all the marks for all quizzes from each class earned by a student
  */
  async requestStudentStatistics(classId) {
    const data = await axios({
      url: `${API_URL}/statistics/marks_groups_quizzes?id=${classId}`,
      headers: this.props.userToken,
    });
    return data.data;
  }
  /*
  Reloads the sidebar by making a new request and retriving the new updated groups that
  needs to be displayed in the sidebar. This function is called every
  time a change is made in the groups or the quizzes created by a user.
  */
  reloadBar() {
    this.setState({ loading: true });
    axios({
      url: `${API_URL}/users/mine/groups`,
      headers: this.props.userToken,
    })
    .then((response) => {
      let responseClasses = response.data.reverse();
      if (this.state.userT === TEACHER) {
        responseClasses = responseClasses.filter(obj => obj.role === 'admin');
      } else if (this.state.userT === STUDENT) {
        responseClasses = responseClasses.filter(obj => obj.role === 'student');
      }

      const newSideBarContent = { classes: responseClasses };
      setTimeout(() => {
        this.setState({
          sideBarContent: newSideBarContent,
          panelType: 'my_classes_default_panel',
          loading: false,
        });
      }, 1200);
    });
  }
  /*
  Saves in the cookie the current class id and title so they can
  be used in case the user refreshes the page
  */
  saveCurrentClass(id, title) {
    this.id = id;
    cookie.save('current-class-id', id);
    cookie.save('current-class-title', title);
  }
  /*
  Function that handles the click in the title
  removing the class id and the title from the cookie
  so after a refresh the user will be redirected to the default panel
  */
  handleSideBarTitleClick() {
    cookie.remove('current-class-id');
    cookie.remove('current-class-title');
    this.setState({ panelType: 'my_classes_default_panel' });
  }
  /*
  Handles the click on the user request invite tab
  */
  handleSearchClassForRequestInvite() {
    this.setState({ panelType: 'show_search_class_panel' });
  }
  /*
  Handles the click on the manage students from a class tab
  */
  handleManageStudentsFromClass() {
    this.setState({ panelType: 'manage_studens_panel' });
  }
  /*
  Handles the click on the manage quizzes from a class tab
  */
  handleManageQuizzesFromClass() {
    this.setState({ panelType: 'manage_quizzes_panel' });
  }
  /*
  Handles the click on the side bar class item.
  */
  handleSideBarClassClick(classId, classTitle) {
    this.getClassContent(classId);
    this.saveCurrentClass(classId, classTitle);
    this.setState({ currentClassId: classId, currentClassTitle: classTitle });
  }
  /*
  Handles the click on the create class button from the sidebar
  */
  handleCreateClassClick() {
    cookie.remove('current-class-id');
    cookie.remove('current-class-title');
    this.setState({ panelType: 'create_new_class' });
  }
  /*
  Makes a request to create a new class
  */
  handleSaveNewClassClick(newClassTitle) {
    this.setState({ loading: true });
    const newClassObj = { name: newClassTitle };
    axios({
      url: `${API_URL}/groups`,
      method: 'post',
      data: newClassObj,
      headers: this.props.userToken,
    })
    .then(() => {
      this.reloadBar();
    });
  }
  /*
  Makes a request to delete a class given the classId
  @param classId {Number} [class id]
  */
  confirmDeleteClass(classId) {
    this.setState({ loading: true });
    axios({
      url: `${API_URL}/groups/${classId}`,
      method: 'delete',
      headers: this.props.userToken,
    })
    .then(() => {
      this.reloadBar();
      cookie.remove('current-class-id');
      cookie.remove('current-class-title');
      this.setState({ panelType: 'my_classes_default_panel' });
    });

    this.closeModal();
  }
  /*
    Opens a modal when the user wants to delete a class
  */
  handleDeleteClass(deleteClassId) {
    this.openModal({
      header: 'Delete this class?',
      body: 'Are you sure that you want to DELETE this class? This is an irreversible action which will affect the currenlty enrolled students and assigned quizzes!',
      buttons: ['close', 'deleteClass'],
      modalProps: { classId: deleteClassId },
    });
  }
  /*
  Makes a request to update the current quizzes assigned to a class
  */
  handleSaveAssignedQuizzes(newQuizzesArray) {
    this.setState({ loading: true });
    this.newQuizzesArray = [];
    const quizzesIdArray = newQuizzesArray.map(obj => obj.id);
    const postObject = { quizzes: quizzesIdArray };
    const groupId = this.state.currentClassId.toString();
    axios({
      url: `${API_URL}/groups/${groupId}/quizzes_update`,
      method: 'post',
      data: postObject,
      headers: this.props.userToken,
    })
    .then(() => {
      setTimeout(() => {
        this.setState({
          panelType: 'show_selected_class',
          loading: false,
        });
      }, 1200);
    });
  }
  /*
    Makes a request to save the current student enrolled in a class
  */
  handleSaveEnrolledStudents(newStundentsArray) {
    this.setState({ loading: true });
    this.newStundentsArray = newStundentsArray;
    const studentsIdArray = newStundentsArray.map(obj => obj.email);
    const postObject = { users: studentsIdArray };
    const groupId = this.state.currentClassId.toString();

    axios({
      url: `${API_URL}/groups/${groupId}/users_update`,
      method: 'post',
      data: postObject,
      headers: this.props.userToken,
    })
    .then(() => {
      setTimeout(() => {
        this.setState({
          panelType: 'show_selected_class',
          loading: false,
        });
      }, 1200);
    });
  }
  /*
    Function that renders the classes panel
  */
  renderClassesPanel() {
    const element = (
      <MyClassesPanel
        userToken={this.props.userToken}
        userType={this.state.userT}
        classId={this.state.currentClassId}
        classTitle={this.state.currentClassTitle}
        panelType={this.state.panelType}
        content={this.state.content}
        allClasses={this.state.allClasses}
        allQuizzes={this.state.allQuizzes}
        allStudents={this.state.allStudents}
        averagePerCreatedClass={formatAveragePerCreatedClass(this.state.averagePerCreatedClass)}
        getClassMarks={classId => this.requestStudentStatistics(classId)}
        numberOfClasses={this.state.sideBarContent.classes.length}
        classes={this.state.sideBarContent.classes}
        getAllClasses={() => this.getAllClasses()}
        updateAllStudents={object => this.updateAllStudents(object)}
        handleSaveNewClassClick={newClassTitle =>
          this.handleSaveNewClassClick(newClassTitle)}
        handleSaveAssignedQuizzes={newQuizzesArray =>
          this.handleSaveAssignedQuizzes(newQuizzesArray)}
        handleSaveEnrolledStudents={newStudentsArray =>
          this.handleSaveEnrolledStudents(newStudentsArray)}
        handleManageStudentsFromClass={() => this.handleManageStudentsFromClass()}
        handleManageQuizzesFromClass={() => this.handleManageQuizzesFromClass()}
        handleDeleteClass={id => this.handleDeleteClass(id)}
        manageSearch={value => this.manageSearch(value)}
        requestsList={this.state.requestsList}
        invitedList={this.state.invitedList}
        refreshStudents={(classID, ptype) => this.refreshStudents(classID, ptype)}
        handleSideBarClassClick={(currentClassId, classTitle) =>
          this.handleSideBarClassClick(currentClassId, classTitle)}
      />);
    return element;
  }
  /*
    Renders the side bar and sending the required props to the SideBarWrapper
  */
  renderSideBar() {
    const sidebar = (
      <SideBarWrapper
        onSideBarTitleClick={() => this.handleSideBarTitleClick()}
        onCreateClassClick={() => this.handleCreateClassClick()}
        sideBarContent={this.state.sideBarContent}
        handleSearchClassForRequestInvite={() => this.handleSearchClassForRequestInvite()}
        onSideBarItemClick={(currentClassId, classTitle) =>
          this.handleSideBarClassClick(currentClassId, classTitle)}
        title={'My Classes'}
        type={'SideBarClasses'}
        userType={this.state.userT}
      />
    );

    return sidebar;
  }
  /*
  Main render function
  */
  render() {
    if (this.state.loadingSideBar) {
      return <BrandSpinner />;
    }
    if (this.state.loading === true) {
      return (
        <div className="myClassesPageWrapper">
          { this.renderSideBar() }
          <div className="contentWrapper">
            <BrandSpinner />
          </div>
        </div>
      );
    } return (
      <div className="myClassesPageWrapper">
        { this.renderSideBar() }
        <div className="contentWrapper">
          { this.renderClassesPanel() }
        </div>
        <ModalError
          show={this.state.showModal}
          content={this.state.modalContent}
          close={() => this.closeModal()}
          confirmDeleteClass={classId => this.confirmDeleteClass(classId)}
        />
      </div>
    );
  }
}

MyClassesPage.propTypes = {
  userToken: PropTypes.shape({}).isRequired,
};
