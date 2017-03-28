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
  HelpContainer,
} from './containers';
import authReducer from './redux/modules/user';

const store = createStore(
  combineReducers({
    auth: authReducer,
    routing: routerReducer,
  }), applyMiddleware(routerMiddleware(hashHistory), thunk));

const history = syncHistoryWithStore(hashHistory, store);


function isAuth() {
  if (!store.getState().auth.token) {
    store.dispatch(push('/home'));
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
        <Route path="/settings" component={SettingsContainer} />
        <Route path="/help" component={HelpContainer} />
      </Route>
      <Route path="/home" component={MainPageContainer} />
      <Route path="/login" component={LoginContainer} />
      <Route path="/signup" component={SignupContainer} />
    </Router>
  </Provider>,
  document.getElementById('root'),
);
