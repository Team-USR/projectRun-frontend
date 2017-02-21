import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Router, Route, browserHistory } from 'react-router';
import App from './App';
import LoginContainer from './containers/LoginContainer';
import './index.css';

function isAuth(nextState, replace) {
  if (!document.cookie.split(';').filter(s => s.includes('token=')).length > 0) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    });
  }
}

function tokenManagement(state = { token: '' }, action) {
  switch (action.type) {
    case 'USER_LOGIN':
      return Object.assign({}, state, {
        token: action.token,
      });
    default:
      return state;
  }
}

const store = createStore(tokenManagement);


ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} >
      <Route path="/" component={App} onEnter={isAuth} />
      <Route path="/login" component={LoginContainer} />
    </Router>
  </Provider>,
  document.getElementById('root'),
);
