import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { LoginForm } from '../components/Login';

const registerUserSession = (currentToken, newToken) => {
  switch (newToken) {
    case currentToken:
      return currentToken;
    default:
      return newToken;
  }
};

const mapStateToProps = state => ({
  token: registerUserSession(state.token, state.newToken),
});

const mapDispatchToProps = dispatch => ({
  onLogin: (nextPathname) => {
    dispatch(push(nextPathname));
  },
});

const LoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginForm);

export default LoginContainer;
