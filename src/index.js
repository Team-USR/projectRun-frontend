import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import App from './App';
import { LoginForm } from './components/Login';
import './index.css';


ReactDOM.render(
  <Router history={browserHistory} >
    <Route path="/" component={App} />
    <Route path="/login" component={LoginForm} />
  </Router>,
  document.getElementById('root'),
);
