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
            onChange={this.props.handleNameChange}
          />
          <ControlLabel className="signupLabel">Email</ControlLabel>
          <FormControl
            id="signupEmail"
            type="email" placeholder="Enter email"
            onChange={this.props.handleEmailChange}
          />
          <ControlLabel className="signupLabel">Password</ControlLabel>
          <FormControl
            id="signupPass"
            type="password" placeholder="Enter password"
            onChange={this.props.handlePasswordChange}
          />
        </form>
        <div className="signupButtonWrapper">
          <Button onClick={this.props.signupUser}>Sign up</Button>
        </div>
      </div>
    );
  }
}

SignupWrapper.propTypes = {
  handleNameChange: React.PropTypes.func.isRequired,
  handleEmailChange: React.PropTypes.func.isRequired,
  handlePasswordChange: React.PropTypes.func.isRequired,
  signupUser: React.PropTypes.func.isRequired,
};
