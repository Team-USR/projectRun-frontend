import { connect } from 'react-redux';
import React from 'react';
import SignupForm from '../components/SignupForm';
import * as userActions from '../redux/modules/user';

class SignupContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      password: '',
    };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value });
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  handleLogin() {
    this.props.signupUser({
      email: this.state.email,
      name: this.state.name,
      password: this.state.password
    });
  }

  render() {
    if (!this.props.auth.isLoggingUser) {
      return (
        <div>
          <SignupForm
            handleEmailChange={this.handleEmailChange}
            handleNameChange={this.handleNameChange}
            handlePasswordChange={this.handlePasswordChange}
            signupError={this.props.auth.error}
            submitSignup={this.handleLogin}
            name={this.state.name}
            email={this.state.email}
            password={this.state.password}
          />
        </div>
      );
    }
    return (
      <div>Signup in...</div>
    );
  }
}

SignupContainer.propTypes = {
  signupUser: React.PropTypes.func.isRequired,
  auth: React.PropTypes.shape({
    isLoggingUser: React.PropTypes.boolean,
    error: React.PropTypes.string,
  }).isRequired,
}

export default connect(
  state => ({ auth: state.auth }),
  userActions,
)(SignupContainer);
