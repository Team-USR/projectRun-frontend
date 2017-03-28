import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookie';
import Toggle from 'react-toggle';
import { Tabs, Tab, Grid, Col, Row } from 'react-bootstrap';
import { STUDENT, TEACHER, API_URL } from '../../constants';
import { PasswordManager } from './';

/*
* Component that manages the content from the Settings page.
*/
export default class SettingsPage extends Component {

  /**
  * This is the Main Constructor for Settings
  * @param {Object} props object of properties
  */
  constructor(props) {
    super(props);
    this.state = {
      isTeacher: false,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      statusText: '',
      userName: '',
      email: '',
      err: null,
    };
  }

  /**
  * This function is called before 'render()'
  * It loads the cookies and checks if the
  * user is TEACHER or STUDENT to set the userType
  */
  componentWillMount() {
    const settingUserType = cookie.load('userType');
    const user = cookie.load('username');
    const em = cookie.load('uid');
    this.setState({ userName: user, email: em });
    if (settingUserType === TEACHER) {
      this.setState({ isTeacher: true });
    }
  }

  /**
  * This is an async function which makes a PUT request
  * in order to change the password
  * It catches the error and display a meesage
  */
  async changePassword() {
    await axios({
      url: `${API_URL}/users/password`,
      headers: this.props.userToken,
      method: 'put',
      data: {
        current_password: this.state.currentPassword,
        password: this.state.newPassword,
        password_confirmation: this.state.confirmPassword,
      },
    })
    .then(res => this.setState({
      statusText: res.statusText,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }))
    .catch(err => this.setState({ err: err.response.data.errors.full_messages.join(', ') }));
  }

  /**
  * Function called everytime when user types in Current password input
  * It stores the value of the input
  * @param {Event} e The event triggerd on key press
  */
  handleCurrentPassword(e) {
    this.setState({ currentPassword: e.target.value });
  }

  /**
  * Function called everytime when user types in New password input
  * It stores the value of the input
  * @param {Event} e The event triggerd on key press
  */
  handleNewPassword(e) {
    this.setState({ newPassword: e.target.value });
  }

  /**
  * Function called everytime when user types in Confirm password input
  * It stores the value of the input
  * @param {Event} e The event triggerd on key press
  */
  handleConfirmPassword(e) {
    this.setState({ confirmPassword: e.target.value });
  }

  /**
  * Function which is used to toggle between TEACHER
  * and STUDENT Mode, adding and removing the cookies
  */
  changeUserType() {
    if (this.state.isTeacher) {
      cookie.save('userType', STUDENT);
      this.setState({ isTeacher: false });
      this.props.changeUserType(STUDENT);
    } else {
      cookie.save('userType', TEACHER);
      this.setState({ isTeacher: true });
      this.props.changeUserType(TEACHER);
    }
    cookie.remove('current-class-id');
    cookie.remove('current-class-title');
    cookie.remove('current-session-id');
    cookie.remove('current-session-type');
  }

  /**
  * Function used for displaying the Probile Tab in Setting Page
  * It contains user infomration and the Toggle where you can
  * switch your userType Mode
  * @return {Object} The Probile Tab Component
  */
  renderProfileTab() {
    this.profile = [];
    return (
      <div className="settings_tab">
        <h2>Profile</h2>
        <form>
          <div className="information">
            <h3><span className="settings_item">Name:</span> {this.state.userName} </h3>
            <h3><span className="settings_item">Email:</span> {this.state.email} </h3>
          </div>
          <label htmlFor={'userType'}>
            <span>Student</span>
            <Toggle
              defaultChecked={this.state.isTeacher}
              icons={false}
              onChange={() => this.changeUserType()}
            />
            <span>Teacher</span>
          </label>
        </form>
      </div>
    );
  }

  /**
  * Function used for displaying the Password Tab in Setting Page
  * It contains the PasswordManagerComponent and passes all
  * event handlers to it
  * @return {Object} The Password Tab Component
  */
  renderPasswordTab() {
    return (
      <PasswordManager
        currentPassword={this.state.currentPassword}
        newPassword={this.state.newPassword}
        confirmPassword={this.state.confirmPassword}
        handleCurrentPassword={e => this.handleCurrentPassword(e)}
        handleNewPassword={e => this.handleNewPassword(e)}
        handleConfirmPassword={e => this.handleConfirmPassword(e)}
        updateNewValidation={status => this.updateNewValidation(status)}
        updateConfirmValidation={status => this.updateConfirmValidation(status)}
        changePassword={() => this.changePassword()}
        resetError={this.state.err}
      />
    );
  }

  /**
  * This is the main render function which is in charge of displaying
  * the Tabs in Setting Page. It calls the renderProfileTab() and
  * renderPasswordTab() functions to render them
  * @return {Object} The Settings Component
  */
  render() {
    const profileTab = this.renderProfileTab();
    const passwordTab = this.renderPasswordTab();
    return (
      <Grid className="options_container">
        <Row>
          <Col md={12}>
            <h1><b>Settings</b></h1>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
              <Tab eventKey={1} title="Profile" className="settings_tab_container">
                { profileTab }
              </Tab>
              <Tab eventKey={2} title="Password" className="settings_tab_container">
                { this.state.statusText === 'OK' ?
                  <h3>Password updated!</h3>
                  : passwordTab }
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Grid>
    );
  }
}

SettingsPage.propTypes = {
  changeUserType: React.PropTypes.func.isRequired,
  userToken: React.PropTypes.shape({}).isRequired,
};
