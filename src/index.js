import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux';
import App from './App';
import LoginContainer from './containers/LoginContainer';
import reducer from './redux/modules/user';
import './index.css';

const store = createStore(
  combineReducers({
    reducer,
    routing: routerReducer,
  }), applyMiddleware(routerMiddleware));

const history = syncHistoryWithStore(browserHistory, store);


function isAuth() {
  if (store.getState().reducer.token === '') {
    console.log(store.getState());
    store.dispatch(history.push('/login'));
    window.location.reload();
  }
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} >
      <Route path="/" component={App} onEnter={isAuth} />
      <Route path="/login" component={LoginContainer} />
    </Router>
  </Provider>,
  document.getElementById('root'),
);
