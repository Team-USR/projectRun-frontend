import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux';
import App from './App';
import { HomePage } from './components/UserAccount';
import thunk from 'redux-thunk';

import {
  QuizViewerContainer,
  LoginContainer,
  MyQuizzesContainer,
  MyClassesContainer,
  SignupContainer,
} from './containers';
import authReducer from './redux/modules/user';

const store = createStore(
  combineReducers({
    auth: authReducer,
    routing: routerReducer,
  }), applyMiddleware(routerMiddleware(browserHistory), thunk));

const history = syncHistoryWithStore(browserHistory, store);


function isAuth() {
  if (store.getState().auth.token === null) {
    store.dispatch(push('/login'));
  }
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} >
      <Route path="/" component={App} onEnter={isAuth} >
        <IndexRoute component={HomePage} />
        <Route path="/quiz" component={QuizViewerContainer} />
        <Route path="/quiz-generator" component={MyQuizzesContainer} />
        <Route path="/my-quizzes" component={MyQuizzesContainer} />
        <Route path="/my-classes" component={MyClassesContainer} />
      </Route>
      <Route path="/login" component={LoginContainer} />
      <Route path="/signup" component={SignupContainer} />
    </Router>
  </Provider>,
  document.getElementById('root'),
);
