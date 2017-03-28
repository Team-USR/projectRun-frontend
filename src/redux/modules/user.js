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

const CHANGE_USER_TYPE = 'CHANGE_USER_TYPE';

/**
 * Initialize user store if cookies are saved from a previous log in
 * @type {Object}
 */
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
    userType: cookie.load('userType'),
  };
}

/**
 * The main reducer for the redux store, that handles
 * the user management
 * @param  {Object} [state=initialState] the state of the store
 * @param  {Object} action               object containg an action type
 * @return {Object}                      new store state
 */
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case USER_LOGIN_IN_PROGRESS:
      return Object.assign({}, { loginInProgress: true });
    case USER_LOGIN_FAILED:
      return Object.assign({}, { error: action.error });
    case USER_LOGIN_SUCCESFUL:
      return Object.assign({}, { ...state, token: action.auth, name: action.user.name });
    case USER_LOGOUT:
      return Object.assign({});
    case USER_SIGNUP_IN_PROGRESS:
      return Object.assign({}, { signupInProgress: true });
    case USER_SIGNUP_FAILED:
      return Object.assign({}, { error: action.error });
    case USER_SIGNUP_SUCCESFUL:
      return Object.assign({}, { });
    case CHANGE_USER_TYPE:
      return Object.assign({}, { ...state, userType: action.userType });
    default:
      return state;
  }
}
/**
 * Sets the store state to login in progress
 * @return {Object} action type
 */
export function userLoginInProgress() {
  return {
    type: USER_LOGIN_IN_PROGRESS,
  };
}

/**
 * Acknowledges user login, storing the server
 * response inside the store
 * @param  {Object} auth server response
 * @param  {Object} user server response
 * @return {Object}      new store state
 */
export function userLoginSuccesful(auth, user) {
  return {
    type: USER_LOGIN_SUCCESFUL,
    auth,
    user,
  };
}

/**
 * Sets the state to login failed and
 * displays the error
 * @param  {Object} error server response
 * @return {Object}       new store state
 */
export function userLoginFailed(error) {
  return {
    type: USER_LOGIN_FAILED,
    error,
  };
}

/**
 * Collects the form data and sends the login
 * request to the backend, redirecting the user
 * to the home page if successful
 * @param  {Object} user login form data
 * @return {Object}      new store state
 */
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
          }, {
            name: res.data.data.name,
          },
        ));
        dispatch(push('/'));
      }
    } catch (err) {
      dispatch(userLoginFailed(err.response.data.errors.join(', ')));
    }
  };
}

/**
 * Sets the store state to signup is progress
 * @return {Object} new store state
 */
export function userSignupInProgress() {
  return {
    type: USER_SIGNUP_IN_PROGRESS,
  };
}

/**
 * Sets the store state to sign up successful
 * @return {Object} new store state
 */
export function userSignupSuccesful() {
  return {
    type: USER_SIGNUP_SUCCESFUL,
  };
}
/**
 * Sets the store state to sign up failed
 * @param  {Object} error server response
 * @return {Object}       new store state
 */
export function userSignupFailed(error) {
  return {
    type: USER_SIGNUP_FAILED,
    error,
  };
}
/**
 * Collects the signup form data and sends
 * a request to the server, redirecting the user
 * to the login page if successful
 * @param  {Object} user sign up form data
 * @return {Object}      new store state
 */
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

/**
 * Removes existing user cookies and overwrites the store state
 * @return {Object} new store state
 */
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
/**
 * Used by the toggle inside settings,
 * it allows users to swap between their
 * account types
 * @param  {String} userType STUDENT or TEACHER
 * @return {Object}          new store state
 */
export function changeUserType(userType) {
  return {
    type: CHANGE_USER_TYPE,
    userType,
  };
}
