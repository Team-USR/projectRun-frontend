import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux';
import App from './App';
import { QuizViewerMainPage } from './quizManager/quizzesViewerPage';
import { QuizCreatorMainPage } from './quizManager/quizzesCreatorPage';
import LoginContainer from './containers/LoginContainer';
import reducer from './redux/modules/user';
import './index.css';

const store = createStore(
  combineReducers({
    reducer,
    routing: routerReducer,
  }), applyMiddleware(routerMiddleware(browserHistory)));

const history = syncHistoryWithStore(browserHistory, store);


function isAuth() {
  if (store.getState().reducer.token === '') {
    store.dispatch(push('/login'));
  }
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} >
      <Route path="/" component={App} onEnter={isAuth} />
      <Route path="/quiz" component={QuizViewerMainPage} onEnter={isAuth} />
      <Route path="/quizGenerator" component={QuizCreatorMainPage} onEnter={isAuth} />
      <Route path="/login" component={LoginContainer} />

    </Router>
  </Provider>,
  document.getElementById('root'),
);
