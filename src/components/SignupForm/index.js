import React from 'react';
import { ControlLabel, form, FormControl, Button, ButtonGroup } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

/**
 * Signup component to be served by /signup
 * @param {Object} props inherited properties
 */
export default function SignupForm(props) {
  /**
   * Any signup request error
   * @type {Object}
   */
  let error;
  if (props.signupError) {
    error = <h4 className="text-danger text-center">{props.signupError}</h4>;
  }
  /**
   * Returns the actual form
   * @type {Object}
   */
  return (
    <div className="loginPage">
      <div className="signupWrapper cardSection">
        {error}
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
        <div className="signupButtonWrapper">
          <ButtonGroup style={{ float: 'right' }}>
            <LinkContainer to={'/login'}>
              <Button>Log in</Button>
            </LinkContainer>
            <Button
              type="submit"
              onClick={props.submitSignup}
            >
            Sign up
          </Button>
          </ButtonGroup>
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

SignupForm.defaultProps = {
  signupError: null,
};
