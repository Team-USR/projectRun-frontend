import { connect } from 'react-redux';
import React from 'react';
import SignupForm from '../components/SignupForm';
import { BrandSpinner } from '../components/utils';
import * as userActions from '../redux/modules/user';

/**
 * SignupForm container to be connected to the Redux store
 * @type {Object}
 */
class SignupContainer extends React.Component {
  /**
   * Initializes the container
   * @param  {Object} props inherited properties
   */
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
    this.handleSignup = this.handleSignup.bind(this);
  }
  /**
   * Saves input from name field into state
   * @param  {event} e event
   * @return {undefined}
   */
  handleNameChange(e) {
    this.setState({ name: e.target.value });
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
   * Calls the signup request functions received as props
   * @return {undefined}
   */
  handleSignup() {
    this.props.signupUser({
      email: this.state.email,
      name: this.state.name,
      password: this.state.password,
    });
  }
  /**
   * Returns the SignupForm
   * @return {Object}
   */
  render() {
    if (!this.props.auth.signupInProgress) {
      return (
        <div>
          <SignupForm
            handleEmailChange={this.handleEmailChange}
            handleNameChange={this.handleNameChange}
            handlePasswordChange={this.handlePasswordChange}
            signupError={this.props.auth.error}
            submitSignup={this.handleSignup}
            name={this.state.name}
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

SignupContainer.propTypes = {
  signupUser: React.PropTypes.func.isRequired,
  auth: React.PropTypes.shape({
    signupInProgress: React.PropTypes.boolean,
    error: React.PropTypes.string,
  }).isRequired,
};

/**
 * Connects the SignupContainer to the redux store
 * @type {[type]}
 */
export default connect(
  state => ({ auth: state.auth }),
  userActions,
)(SignupContainer);
