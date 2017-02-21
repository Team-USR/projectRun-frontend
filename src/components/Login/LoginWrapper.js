import React from 'react';
import { ControlLabel, form, FormControl } from 'react-bootstrap';
import { ButtonWrapper } from './index';


export default function LoginWrapper(props) {
  return (
    <div className="loginWrapper">
      <form>
        <ControlLabel className="loginLabel">Email</ControlLabel>
        <FormControl
          id="formEmail"
          type="email" placeholder="Enter email"
          onChange={props.handleEmailChange}
        />
        <ControlLabel className="loginLabel">Password</ControlLabel>
        <FormControl
          id="formPassword"
          type="password" placeholder="Enter password"
          onChange={props.handlePasswordChange}
        />
      </form>
      <ButtonWrapper
        changeToSignup={props.changeToSignup}
        loginUser={props.loginUser}
      />
    </div>
  );
}

LoginWrapper.propTypes = {
  handleEmailChange: React.PropTypes.func.isRequired,
  handlePasswordChange: React.PropTypes.func.isRequired,
  changeToSignup: React.PropTypes.func.isRequired,
  loginUser: React.PropTypes.func.isRequired,
};
