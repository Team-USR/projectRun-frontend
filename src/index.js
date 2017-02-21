import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import cookie from 'react-cookie';
import axios from 'axios';
import { Router, Route, browserHistory } from 'react-router';
import App from './App';
import LoginContainer from './containers/LoginContainer';
import reducer from './redux/modules/user';
import './index.css';

const store = createStore(reducer, { token: cookie.load('token') || '' });

function isAuth() {
  axios.get('https://project-run.herokuapp.com/test',
  { headers: { Authorization: store.getState().token } }).then(res => console.log(res));
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} >
      <Route path="/" component={App} onEnter={isAuth} />
      <Route path="/login" component={LoginContainer} />
    </Router>
  </Provider>,
  document.getElementById('root'),
);
