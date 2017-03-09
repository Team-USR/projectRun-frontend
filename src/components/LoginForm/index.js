import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { ControlLabel, form, FormControl, Button, ButtonGroup } from 'react-bootstrap';

export default function LoginForm(props) {
  let error;
  if (props.loginError) {
    error = <h3 className="invalidHeader">{props.loginError}</h3>;
  }

  return (
    <div className="loginPage">
      <h1 className="welcomeTitle" id="title">Welcome!</h1>
      {error}
      <div className="loginWrapper">
        <form>
          <ControlLabel className="loginLabel">Email</ControlLabel>
          <FormControl
            id="formEmail"
            type="email"
            placeholder="Enter email"
            onChange={props.handleEmailChange}
            value={props.email}
          />
          <ControlLabel className="loginLabel">Password</ControlLabel>
          <FormControl
            id="formPassword"
            type="password" placeholder="Enter password"
            value={props.password}
            onChange={props.handlePasswordChange}
          />
        </form>
        <div className="loginButtonWrapper">
          <ButtonGroup>
            <Button
              type="submit"
              onClick={props.submitLogin}
            >
              Login
            </Button>
            <LinkContainer to={'/signup'}>
              <Button>Sign-up</Button>
            </LinkContainer>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
}

LoginForm.propTypes = {
  loginError: React.PropTypes.string,
  submitLogin: React.PropTypes.func.isRequired,
  handleEmailChange: React.PropTypes.func.isRequired,
  handlePasswordChange: React.PropTypes.func.isRequired,
  email: React.PropTypes.string.isRequired,
  password: React.PropTypes.string.isRequired,
};
