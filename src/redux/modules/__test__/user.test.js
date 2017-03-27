import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as actions from '../user';
import { API_URL } from '../../../constants';

const mock = new MockAdapter(axios);
mock.onPost(`${API_URL}/users/sign_in`, {
  email: 'signin-test@gmail.com',
  password: 'passwordtest',
}).reply(200, {
  data: {
    name: 'testName',
  },
}, {
  'access-token': 'test-access-token',
  client: 'test-client',
  'token-type': 'Bearer',
  uid: 'signup-test@gmail.com',
},
);

describe('Actions test', () => {
  it('should return userLoginInProgress', () => {
    const expectedAction = {
      type: 'USER_LOGIN_IN_PROGRESS',
    };
    expect(actions.userLoginInProgress()).toEqual(expectedAction);
  });

  // it('should return userLoginSuccesful object', () => {
  //   const auth = {
  //     'access-token': 'test-access-token',
  //     client: 'test-client',
  //     'token-type': 'Bearer',
  //     uid: 'signup-test@gmail.com',
  //   };
  //   const user = {
  //     name: 'testName',
  //   };
  //   const expectedAction = {
  //     type: 'USER_LOGIN_SUCCESFUL',
  //     token: auth,
  //     name: user,
  //   };
  //   expect(actions.userLoginSuccesful(auth, user)).toEqual(expectedAction);
  // });

  // it('should return 200 and an auth obj', () => {
  //   const toSendUser = {
  //     email: 'signin-test@gmail.com',
  //     password: 'passwordtest',
  //   };
  //   const auth = {
  //     'access-token': 'test-access-token',
  //     client: 'test-client',
  //     'token-type': 'Bearer',
  //     uid: 'signup-test@gmail.com',
  //   };
  //   const user = {
  //     name: 'testName',
  //   };
  //   const expectedAction = [{
  //     type: 'USER_LOGIN_IN_PROGRESS',
  //   }, {
  //     type: 'USER_LOGIN_SUCCESFUL',
  //     token: auth,
  //     name: user,
  //   }];
  //   expect(actions.loginUser(toSendUser)).toEqual(expectedAction);
  // });
});
