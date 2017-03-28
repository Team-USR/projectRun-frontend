import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux';
import App from './App';
import { HomePage } from './components/UserAccount';

import {
  QuizViewerContainer,
  LoginContainer,
  MyQuizzesContainer,
  MyClassesContainer,
  SignupContainer,
  SettingsContainer,
  MainPageContainer,
} from './containers';
import authReducer from './redux/modules/user';

/**
 * Redux function which creates the store and applies
 * middleware functions
 * @type {Object}
 */
const store = createStore(
  combineReducers({
    auth: authReducer,
    routing: routerReducer,
  }), applyMiddleware(routerMiddleware(hashHistory), thunk));

/**
 * React-redux-router dependency
 * @type {Object}
 */
const history = syncHistoryWithStore(hashHistory, store);

/**
 * Checks if users is authenticated
 * in order to be able to access
 * the app functionalities
 * @return {undefined}
 */
function isAuth() {
  if (!store.getState().auth.token) {
    store.dispatch(push('/home'));
  }
}
/**
 * Core React function, binding the app and the HTML page
 * @type {Object}
 */
ReactDOM.render(
  <Provider store={store}>
    <Router history={history} >
      <Route path="/" component={App} onEnter={isAuth} >
        <IndexRoute component={HomePage} />
        <Route path="/quiz" component={QuizViewerContainer} />
        <Route path="/quiz-generator" component={MyQuizzesContainer} />
        <Route path="/my-quizzes" component={MyQuizzesContainer} />
        <Route path="/my-classes" component={MyClassesContainer} />
        <Route path="/settings" component={SettingsContainer} />
      </Route>
      <Route path="/home" component={MainPageContainer} />
      <Route path="/login" component={LoginContainer} />
      <Route path="/signup" component={SignupContainer} />
    </Router>
  </Provider>,
  document.getElementById('root'),
);
