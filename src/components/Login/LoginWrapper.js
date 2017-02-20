import React from 'react';
import { ControlLabel, form, FormControl } from 'react-bootstrap';
import { ButtonWrapper } from './index';


export class LoginWrapper extends React.Component {
  render() {
    return (
      <div className="loginWrapper">
        <form>
          <ControlLabel className="loginLabel">Email</ControlLabel>
          <FormControl
            id="formEmail"
            type="email" placeholder="Enter email"
            onChange={this.props.handleEmailChange}
          />
          <ControlLabel className="loginLabel">Password</ControlLabel>
          <FormControl
            id="formPassword"
            type="password" placeholder="Enter password"
            onChange={this.props.handlePasswordChange}
          />
        </form>
        <ButtonWrapper
          changeToSignup={this.props.changeToSignup}
          loginUser={this.props.loginUser}
        />
      </div>
    );
  }
}

LoginWrapper.propTypes = {
  handleEmailChange: React.PropTypes.func.isRequired,
  handlePasswordChange: React.PropTypes.func.isRequired,
  changeToSignup: React.PropTypes.func.isRequired,
  loginUser: React.PropTypes.func.isRequired,
};
