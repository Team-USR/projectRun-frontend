import { connect } from 'react-redux';
import React from 'react';
import LoginForm from '../components/LoginForm';
import { BrandSpinner } from '../components/utils';
import * as userActions from '../redux/modules/user';

/**
 * LoginForm container to be connected to the Redux store
 * @type {Object}
 */
class LoginContainer extends React.Component {
  /**
   * Initializes the container
   * @param  {Object} props inherited properties
   */
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
  /**
   * Saves input from email field into state
   * @param  {event} e event
   * @return {undefined}
   */
  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }
  /**
   * Saves input from password field into state
   * @param  {event} e event
   * @return {undefined}
   */
  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }
  /**
   * Calls the login function received as props
   * @return {undefined}
   */
  handleLogin() {
    this.props.loginUser({
      email: this.state.email,
      password: this.state.password,
    });
  }
  /**
   * Renders the LoginForm container
   * @return {Object}
   */
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
      <div><BrandSpinner /></div>
    );
  }
}

LoginContainer.propTypes = {
  loginUser: React.PropTypes.func.isRequired,
  auth: React.PropTypes.shape({
    loginInProgress: React.PropTypes.boolean,
    error: React.PropTypes.string,
  }).isRequired,
};

/**
 * Connects component to store
 * @type {Object}
 */
export default connect(
  state => ({ auth: state.auth }),
  userActions,
)(LoginContainer);
