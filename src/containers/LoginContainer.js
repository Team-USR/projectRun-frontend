import { connect } from 'react-redux';
import cookie from 'react-cookie';
import { push } from 'react-router-redux';
import { LoginForm } from '../components/Login';
import { loggedInUser } from '../redux/modules/user';

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
  onLogin: () => {
    const token = cookie.load('token');
    if (token) {
      dispatch(loggedInUser(token));
    }
    dispatch(push('/'));
  },
});

const LoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginForm);

export default LoginContainer;
