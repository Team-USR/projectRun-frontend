import React, { Component } from 'react';
// import { Button } from 'react-bootstrap';
// import MatchLeftElement, { MatchRightElement, getAnswers } from './MatchElement';
import '../../style/Match/CreateMatchQuiz.css';

export default class CreateMatchQuiz extends Component {
  constructor() {
    super();
    this.state = {};
  }

  renderCreateItems(n) {
    this.n = n;
    const createItems = [];
    for (let i = 1; i <= n; i += 1) {
      createItems[i] = (
        <div className="quizItem" id={i} key={i}>
          <div className="itemIndex">
            <label htmlFor="item">{i}</label>
          </div>
          <textarea name="leftItems" className="itemTexarea leftTextarea" rows="3" cols="30" />
          <textarea name="rightItems" className="itemTexarea rightTextarea" rows="3" cols="30" />
        </div>
      );
    }

    return createItems;
  }

  render() {
    const items = this.renderCreateItems(5);
    const createMatchQuiz = (
      <div className="createMatchQuizContainer">
        <div className="leftColumn">
          <h3> Left Items </h3>
        </div>

        <div className="rightColumn" >
          <h3> Right Items </h3>
        </div>

        <div className="createMatchItems">
          { items.map(obj => obj) }
        </div>

        <div className="defaultOption">
          Default: <textarea className="itemTexarea" rows="3" cols="30" />
        </div>

      </div>
    );

    return createMatchQuiz;
  }

}
