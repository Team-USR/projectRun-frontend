import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux';
import App from './App';
import { HomePage } from './components/UserAccount';
import { QuizCreatorMainPage } from './quizManager/quizzesCreatorPage';
import { QuizViewerContainer, LoginContainer } from './containers';
import reducer from './redux/modules/user';

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
      <Route path="/" component={App} onEnter={isAuth} >
        <IndexRoute component={HomePage} />
        <Route path="/quiz" component={QuizViewerContainer} />
        <Route path="/quiz-generator" component={QuizCreatorMainPage} />
      </Route>
      <Route path="/login" component={LoginContainer} />
    </Router>
  </Provider>,
  document.getElementById('root'),
);
