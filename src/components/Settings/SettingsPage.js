import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookie';
import Toggle from 'react-toggle';
import { Tabs, Tab, Grid, Col, Row } from 'react-bootstrap';
import { STUDENT, TEACHER, API_URL } from '../../constants';
import { PasswordManager } from './';


export default class SettingsPage extends Component {
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

  componentWillMount() {
    const settingUserType = cookie.load('userType');
    const user = cookie.load('username');
    const em = cookie.load('uid');
    this.setState({ userName: user, email: em });
    if (settingUserType === TEACHER) {
      this.setState({ isTeacher: true });
    }
  }

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

  handleCurrentPassword(e) {
    this.setState({ currentPassword: e.target.value });
  }

  handleNewPassword(e) {
    this.setState({ newPassword: e.target.value });
  }

  handleConfirmPassword(e) {
    this.setState({ confirmPassword: e.target.value });
  }

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

  renderPrefTab() {
    this.preferences = [];
    return (
      <div>
        <h1><b>Preferences</b></h1>
      </div>
    );
  }

  render() {
    const profileTab = this.renderProfileTab();
    const passwordTab = this.renderPasswordTab();
//    const prefTab = this.renderPrefTab();
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
              {//  <Tab eventKey={3} title="Preferences">
              //   { prefTab }
              // </Tab>
            }
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
