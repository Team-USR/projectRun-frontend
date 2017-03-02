import { connect } from 'react-redux';
import cookie from 'react-cookie';
import { push } from 'react-router-redux';
import { LoginForm } from '../components/Login';
import { loggedInUser } from '../redux/modules/user';

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
  null,
  mapDispatchToProps,
)(LoginForm);

export default LoginContainer;
