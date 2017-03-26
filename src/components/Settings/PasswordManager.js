import React from 'react';
import { Form, FormGroup, Col,
  ControlLabel, FormControl, HelpBlock, Button } from 'react-bootstrap';

export default class PasswordManager extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      validNew: false,
      validConfirm: false,
    };
    this.validateNewPassword = this.validateNewPassword.bind(this);
    this.validateConfirmPassword = this.validateConfirmPassword.bind(this);
  }

  validateNewPassword() {
    let validateNew = {};
    if (this.props.currentPassword === '' && this.props.newPassword === '') {
      validateNew = {
        status: null,
        text: '',
      };
    } else if (this.props.currentPassword === this.props.newPassword && this.props.newPassword !== '') {
      validateNew = {
        status: 'error',
        text: 'The old and the new password cannot be the same.',
      };
    } else if (this.props.currentPassword !== '' && this.props.newPassword === '') {
      validateNew = {
        status: null,
        text: '',
      };
    } else if (this.props.currentPassword !== '' && this.props.newPassword.length < 7) {
      validateNew = {
        status: 'error',
        text: 'The minimum password length is 8',
      };
    } else if (this.props.currentPassword !== '') {
      validateNew = {
        status: 'success',
        text: '',
      };
    } else {
      validateNew = {
        status: 'error',
        text: 'Please fill in your current password.',
      };
    }
    return validateNew;
  }

  validateConfirmPassword() {
    let validateConfirm = {};
    if (this.props.confirmPassword === '') {
      validateConfirm = {
        status: null,
        text: '',
      };
    } else if (this.props.newPassword !== '' && this.props.confirmPassword !== '' && this.props.newPassword === this.props.confirmPassword) {
      validateConfirm = {
        status: 'success',
        text: '',
      };
    } else if (this.props.confirmPassword !== '' && this.props.confirmPassword !== this.props.newPassword) {
      validateConfirm = {
        status: 'error',
        text: 'The passwords don\'t match.',
      };
    } else {
      validateConfirm = {
        status: 'success',
        test: '',
      };
    }
    return validateConfirm;
  }

  render() {
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
              <FormControl
                type="password"
                placeholder="Current password"
                onChange={e => this.props.handleCurrentPassword(e)}
              />
            </Col>
          </FormGroup>

          <FormGroup
            controlId="formNewPassword"
            validationState={this.validateNewPassword().status}
          >
            <Col componentClass={ControlLabel} sm={2}>
              New password
            </Col>
            <Col sm={6}>
              <FormControl
                type="password"
                placeholder="New password"
                onChange={e => this.props.handleNewPassword(e)}
              />
            </Col>
            {this.validateNewPassword().status === 'error' &&
              (<Col smOffset={2} sm={6}>
                <HelpBlock>{this.validateNewPassword().text}</HelpBlock>
              </Col>)}
          </FormGroup>
          <FormGroup
            controlId="formConfirmPassword"
            validationState={this.validateConfirmPassword().status}
          >
            <Col componentClass={ControlLabel} sm={2}>
              Confirm password
            </Col>
            <Col sm={6}>
              <FormControl
                type="password"
                placeholder="Confirm new password"
                onChange={e => this.props.handleConfirmPassword(e)}
              />
            </Col>
            {this.validateConfirmPassword().status === 'error' &&
              (<Col smOffset={2} sm={6}>
                <HelpBlock>{this.validateConfirmPassword().text}</HelpBlock>
              </Col>)}
          </FormGroup>

          <FormGroup>
            <Col smOffset={4} sm={3}>
              <Button
                onClick={() => this.props.changePassword()}
                disabled={!(this.validateNewPassword().status === 'success'
                && this.validateConfirmPassword().status === 'success')}
              >
                Change password
              </Button>
            </Col>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

PasswordManager.propTypes = {
  currentPassword: React.PropTypes.string.isRequired,
  newPassword: React.PropTypes.string.isRequired,
  confirmPassword: React.PropTypes.string.isRequired,
  handleCurrentPassword: React.PropTypes.func.isRequired,
  handleNewPassword: React.PropTypes.func.isRequired,
  handleConfirmPassword: React.PropTypes.func.isRequired,
  changePassword: React.PropTypes.func.isRequired,
};
