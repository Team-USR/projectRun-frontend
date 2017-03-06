import { connect } from 'react-redux';
import React from 'react';
import LoginForm from '../components/LoginForm';
import * as userActions from '../redux/modules/user';

class LoginContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  handleLogin() {
    this.props.loginUser({
      email: this.state.email,
      password: this.state.password,
    });
  }

  render() {
    if (!this.props.auth.loginInProgress) {
      return (
        <div>
          <LoginForm
            handleEmailChange={this.handleEmailChange}
            handlePasswordChange={this.handlePasswordChange}
            loginError={this.props.auth.error}
            submitLogin={this.handleLogin}
            email={this.state.email}
            password={this.state.password}
          />
        </div>
      );
    }
    return (
      <div>Logging in...</div>
    );
  }
}

LoginContainer.propTypes = {
  loginUser: React.PropTypes.func.isRequired,
  auth: React.PropTypes.shape({
    isLoggingUser: React.PropTypes.boolean,
    error: React.PropTypes.string,
  }).isRequired,
};

export default connect(
  state => ({ auth: state.auth }),
  userActions,
)(LoginContainer);
