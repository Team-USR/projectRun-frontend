import React, { Component } from 'react';
import cookie from 'react-cookie';
import Toggle from 'react-toggle';
import { Tabs, Tab, Grid, Col, Row, FormControl,
  Form, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { STUDENT, TEACHER } from '../../constants';


export default class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTeacher: false,
    };
  }

  componentWillMount() {
    const settingUserType = cookie.load('userType');
    if (settingUserType === TEACHER) {
      this.setState({ isTeacher: true });
    }
  }

  changeUserType() {
    if (this.state.isTeacher) {
      cookie.save('userType', STUDENT);
      this.setState({ isTeacher: false });
    } else {
      cookie.save('userType', TEACHER);
      this.setState({ isTeacher: true });
    }
    cookie.remove('current-class-id');
    cookie.remove('current-class-title');
    cookie.remove('current-session-id');
    cookie.remove('current-session-type');
  }

  renderProfileTab() {
    this.profile = [];
    return (
      <div>
        <h1><b>Profile</b></h1>
        <form>
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
    this.password = [];
    return (
      <div>
        <h1><b>Reset password</b></h1>
        <br />
        <Form horizontal>
          <FormGroup controlId="formCurrentPassword">
            <Col componentClass={ControlLabel} sm={2}>
              Current password
            </Col>
            <Col sm={6}>
              <FormControl type="password" placeholder="Current password" />
            </Col>
          </FormGroup>

          <FormGroup controlId="formNewPassword">
            <Col componentClass={ControlLabel} sm={2}>
              New password
            </Col>
            <Col sm={6}>
              <FormControl type="password" placeholder="New password" />
            </Col>
          </FormGroup>
          <FormGroup controlId="formConfirmPassword">
            <Col componentClass={ControlLabel} sm={2}>
              Confirm password
            </Col>
            <Col sm={6}>
              <FormControl type="password" placeholder="Confirm new password" />
            </Col>
          </FormGroup>

          <FormGroup>
            <Col smOffset={4} sm={3}>
              <Button type="submit" onClick={() => {}}>
                Change password
              </Button>
            </Col>
          </FormGroup>
        </Form>
      </div>
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
    const prefTab = this.renderPrefTab();
    return (
      <Grid>
        <Row>
          <Col md={12}>
            <h1><b>Settings</b></h1>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
              <Tab eventKey={1} title="Profile">
                { profileTab }
              </Tab>
              <Tab eventKey={2} title="Password">
                { passwordTab }
              </Tab>
              <Tab eventKey={3} title="Preferences">
                { prefTab }
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Grid>
    );
  }
}
