import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { ControlLabel, form, FormControl, Button, ButtonGroup } from 'react-bootstrap';
import cookie from 'react-cookie';
import Toggle from 'react-toggle';
import { STUDENT, TEACHER } from '../../constants';

/**
 * LoginForm component, used by the /login router
 * @param {Object} props inherited props
 */
export default function LoginForm(props) {
  /**
   * Login user on enter press in password input
   * @param  {event} e event
   * @return {bool}   last key pressed is enter or not
   */
  function loginUser(e) {
    if (e.which === 13 || e.keyCode === 13) {
      props.submitLogin();
      return false;
    }
    return true;
  }
  /**
   * displays any request error
   * @type {Object}
   */
  let error;
  if (props.loginError) {
    error = <h4 className="text-danger text-center">{props.loginError}</h4>;
  }
  let isTeacher = false;
  /**
   * Returns the actual form
   * @type {Object}
   */
  return (
    <div className="loginPage">
      <div className="loginWrapper cardSection">
        {error}
        <form >
          <ControlLabel className="loginLabel">Email</ControlLabel>
          <FormControl
            id="formEmail"
            type="email"
            placeholder="Enter email"
            onChange={props.handleEmailChange}
            onKeyPress={e => loginUser(e)}
            value={props.email}
          />
          <ControlLabel className="loginLabel">Password</ControlLabel>
          <FormControl
            id="formPassword"
            type="password" placeholder="Enter password"
            value={props.password}
            onKeyPress={e => loginUser(e)}
            onChange={props.handlePasswordChange}
          />
        </form>

        <div className="loginButtonWrapper">
          <form style={{ display: 'inline-flex' }}>
            <div style={{ display: 'inline-block', lineHeight: 10 }}>
              <h5>Student</h5>
            </div>
            <div style={{ marginTop: 5, marginLeft: 5, marginRight: 5 }}>
              <Toggle
                defaultChecked={isTeacher}
                icons={false}
                onChange={() => {
                  if (isTeacher === false) {
                    cookie.save('userType', TEACHER);
                    isTeacher = true;
                  } else {
                    cookie.save('userType', STUDENT);
                    isTeacher = false;
                  }
                }}
              />
            </div>
            <h5>Teacher</h5>
          </form>
          <ButtonGroup style={{ float: 'right' }}>
            <Button
              type="submit"
              onClick={props.submitLogin}
            >
          Log in
        </Button>
            <LinkContainer to={'/signup'}>
              <Button>Sign up</Button>
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
LoginForm.defaultProps = {
  loginError: null,
};
