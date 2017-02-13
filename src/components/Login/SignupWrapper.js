import React from 'react';
import { form, ControlLabel, FormControl, Button } from 'react-bootstrap';
import '../../style/SignupWrapper.css';


export class SignupWrapper extends React.Component {
  render() {
    return (
      <div className="signupWrapper">
        <form>
          <ControlLabel className="signupLabel">Full Name</ControlLabel>
          <FormControl
            id="signupName"
            type="text" placeholder="First name and last name"
          />
          <ControlLabel className="signupLabel">Email</ControlLabel>
          <FormControl
            id="signupEmail"
            type="email" placeholder="Enter email"
          />
          <ControlLabel className="signupLabel">Password</ControlLabel>
          <FormControl
            id="signupPass"
            type="password" placeholder="Enter password"
          />
        </form>
        <div className="signupButtonWrapper">
          <Button>Sign up</Button>
        </div>
      </div>
    );
  }
}
