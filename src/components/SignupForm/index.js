import React from 'react';
import { ControlLabel, form, FormControl, Button } from 'react-bootstrap';

export default function SignupForm(props) {
  let error;
  if (props.signupError) {
    error = <h3 className="invalidHeader">{props.signupError}</h3>;
  }

  return (
    <div className="loginPage">
      <h1 className="welcomeTitle" id="title">Welcome!</h1>
      {error}
      <div className="loginWrapper">
        <form>
          <ControlLabel className="loginLabel">Name</ControlLabel>
          <FormControl
            id="signupName"
            type="text"
            placeholder="First name and last name"
            onChange={props.handleNameChange}
            value={props.name}
          />
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
          <Button
            type="submit"
            onClick={props.submitSignup}
          >
            Signup
          </Button>
        </div>
      </div>
    </div>
  );
}

SignupForm.propTypes = {
  signupError: React.PropTypes.string,
  submitSignup: React.PropTypes.func.isRequired,
  handleNameChange: React.PropTypes.func.isRequired,
  handleEmailChange: React.PropTypes.func.isRequired,
  handlePasswordChange: React.PropTypes.func.isRequired,
  email: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  password: React.PropTypes.string.isRequired,
};
