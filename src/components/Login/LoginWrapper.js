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
          />
          <ControlLabel className="loginLabel">Password</ControlLabel>
          <FormControl
            id="formPassword"
            type="password" placeholder="Enter password"
          />
        </form>
        <ButtonWrapper changeToSignup={this.props.changeToSignup} />
      </div>
    );
  }
}

LoginWrapper.propTypes = {
  changeToSignup: React.PropTypes.func.isRequired,
};
