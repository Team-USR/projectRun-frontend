import axios from 'axios';
import cookie from 'react-cookie';

const USER_LOGIN = 'USER_LOGIN';
const USER_LOGOUT = 'USER_LOGOUT';


export default function reducer(state = { token: cookie.load('token') || '' }, action) {
  switch (action.type) {
    case USER_LOGIN:
      return Object.assign({}, { token: action.token });
    case USER_LOGOUT:
      return Object.assign({});
    default:
      return state;
  }
}

export async function loginUser(user, callback, failedCallback) {
  try {
    const res = await axios.post('https://project-run.herokuapp.com/user_token', {
      auth: {
        email: user.email,
        password: user.password,
      },
    });
    if (res.status.toString() === '201') {
      await cookie.save('token', res.data.jwt);
      callback();
    }
  } catch (err) {
    failedCallback(err);
  }
}

export async function logoutUser() {
  cookie.remove('token');
  return {
    type: USER_LOGOUT,
  };
}

export function loggedInUser(userToken) {
  return {
    type: USER_LOGIN,
    token: userToken,
  };
}
