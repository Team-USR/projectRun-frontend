import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { ControlLabel, form, FormControl, Button, ButtonGroup } from 'react-bootstrap';
import cookie from 'react-cookie';
import Toggle from 'react-toggle';
import { STUDENT, TEACHER } from '../../constants';


export default function LoginForm(props) {
  function loginUser(e) {
    if (e.which === 13 || e.keyCode === 13) {
      props.submitLogin();
      return false;
    }
    return true;
  }

  let error;
  if (props.loginError) {
    error = <h3 className="invalidHeader">{props.loginError}</h3>;
  }
  let isTeacher = false;
  return (
    <div className="loginPage">
      {error}
      <div className="loginWrapper cardSection">
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
          <form style={{ width: 300, display: 'inline-flex' }}>
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
LoginForm.defaultProps = {
  loginError: null,
};
