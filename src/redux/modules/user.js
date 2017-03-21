import axios from 'axios';
import cookie from 'react-cookie';
import { push } from 'react-router-redux';
import { API_URL } from '../../constants';

const USER_LOGIN_IN_PROGRESS = 'USER_LOGIN_IN_PROGRESS';
const USER_LOGIN_SUCCESFUL = 'USER_LOGIN_SUCCESFUL';
const USER_LOGIN_FAILED = 'USER_LOGIN_FAILED';

const USER_LOGOUT = 'USER_LOGOUT';

const USER_SIGNUP_IN_PROGRESS = 'USER_SIGNUP_IN_PROGRESS';
const USER_SIGNUP_SUCCESFUL = 'USER_SIGNUP_SUCCESFUL';
const USER_SIGNUP_FAILED = 'USER_SIGNUP_FAILED';

let initialState = {};
if (cookie.load('access-token') != null) {
  initialState = {
    token: {
      'access-token': cookie.load('access-token'),
      client: cookie.load('client'),
      'token-type': cookie.load('token-type'),
      uid: cookie.load('uid'),
    },
    name: cookie.load('username'),
  };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case USER_LOGIN_IN_PROGRESS:
      return Object.assign({}, { loginInProgress: true });
    case USER_LOGIN_FAILED:
      return Object.assign({}, { error: action.error });
    case USER_LOGIN_SUCCESFUL:
      return Object.assign({}, { token: action.auth });
    case USER_LOGOUT:
      return Object.assign({});
    case USER_SIGNUP_IN_PROGRESS:
      return Object.assign({}, { signupInProgress: true });
    case USER_SIGNUP_FAILED:
      return Object.assign({}, { error: action.error });
    case USER_SIGNUP_SUCCESFUL:
      return Object.assign({}, { });
    default:
      return state;
  }
}

function userLoginInProgress() {
  return {
    type: USER_LOGIN_IN_PROGRESS,
  };
}

function userLoginSuccesful(auth) {
  return {
    type: USER_LOGIN_SUCCESFUL,
    auth,
  };
}

function userLoginFailed(error) {
  return {
    type: USER_LOGIN_FAILED,
    error,
  };
}

export function loginUser(user) {
  return async (dispatch) => {
    try {
      dispatch(userLoginInProgress());
      const res = await axios.post(`${API_URL}/users/sign_in`,
        {
          email: user.email,
          password: user.password,
        },
      );

      if (res.status.toString() === '200') {
        await cookie.save('access-token', res.headers['access-token']);
        await cookie.save('client', res.headers.client);
        await cookie.save('token-type', res.headers['token-type']);
        await cookie.save('uid', res.headers.uid);
        await cookie.save('username', res.data.data.name);


        dispatch(userLoginSuccesful(
          {
            'access-token': res.headers['access-token'],
            client: res.headers.client,
            'token-type': res.headers['token-type'],
            uid: res.headers.uid,
          },
        ));
        dispatch(push('/'));
      }
    } catch (err) {
      dispatch(userLoginFailed(err.response.data.errors.join(', ')));
    }
  };
}

function userSignupInProgress() {
  return {
    type: USER_LOGIN_IN_PROGRESS,
  };
}

function userSignupSuccesful() {
  return {
    type: USER_LOGIN_SUCCESFUL,
  };
}

function userSignupFailed(error) {
  return {
    type: USER_LOGIN_FAILED,
    error,
  };
}

export function signupUser(user) {
  return async (dispatch) => {
    try {
      dispatch(userSignupInProgress());
      const res = await axios.post(`${API_URL}/users`,
        {
          email: user.email,
          name: user.name,
          password: user.password,
        },
      );

      if (res.status.toString() === '200') {
        dispatch(userSignupSuccesful());
        dispatch(push('/login'));
      }
    } catch (err) {
      dispatch(userSignupFailed(err.response.data.errors.full_messages.join(', ')));
    }
  };
}

export function logoutUser() {
  cookie.remove('access-token');
  cookie.remove('client');
  cookie.remove('token-type');
  cookie.remove('userType');
  cookie.remove('uid');
  cookie.remove('username');
  cookie.remove('current-class-id');
  cookie.remove('current-class-title');
  cookie.remove('current-session-type');
  cookie.remove('current-session-id');
  return {
    type: USER_LOGOUT,
  };
}
