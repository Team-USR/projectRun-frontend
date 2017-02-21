import axios from 'axios';
import cookie from 'react-cookie';

const USER_LOGIN = 'USER_LOGIN';
const USER_LOGOUT = 'USER_LOGOUT';


export default function reducer(state = { token: '' }, action) {
  switch (action.type) {
    case USER_LOGIN:
      return Object.assign({}, { token: action.token });
    case USER_LOGOUT:
      return Object.assign({}, { token: '' });
    default:
      return state;
  }
}

export function loginUser(user) {
  axios.post('https://project-run.herokuapp.com/user_token', {
    auth: {
      email: user.email,
      password: user.password,
    },
  }).then((res) => {
    if (res.status.toString() === '201') {
      cookie.save('token', res.data.jwt);
    }
  }).catch(() => {
  });
}

export function logoutUser() {
  console.log('removing token');
  return {
    type: USER_LOGOUT,
  };
}