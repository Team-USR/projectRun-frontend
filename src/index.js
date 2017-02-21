import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import cookie from 'react-cookie';
import { Router, Route, browserHistory } from 'react-router';
import App from './App';
import LoginContainer from './containers/LoginContainer';
import reducer from './redux/modules/user';
import './index.css';

function isAuth(nextState, replace) {
  if (!cookie.load('token')) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    });
  }
}


const store = createStore(reducer, { token: cookie.load('token') || '' });


ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} >
      <Route path="/" component={App} onEnter={isAuth} />
      <Route path="/login" component={LoginContainer} />
    </Router>
  </Provider>,
  document.getElementById('root'),
);
