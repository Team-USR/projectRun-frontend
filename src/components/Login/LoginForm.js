import React from 'react';
import { LoginWrapper, SignupWrapper } from './index';
import '../../style/LoginForm.css';

class LoginForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      login: true,
    };

    this.changeToSignup = this.changeToSignup.bind(this);
  }

  changeToSignup() {
    this.setState({
      login: false,
    });
  }

  render() {
    return (
      <div className="loginPage">
        <h1 id="title">Welcome!</h1>
        {this.state.login && <LoginWrapper changeToSignup={this.changeToSignup} />}
        {!this.state.login && <SignupWrapper />}
      </div>
    );
  }
}

export { LoginForm };
