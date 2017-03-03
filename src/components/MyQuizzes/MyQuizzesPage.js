import React, { Component } from 'react';
import { SideBar } from '../SideBar/index';

export default class MyQuizzes extends Component {

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <div className="myQuizzesPageWrapper">
        <h1><b> My Quizzes</b></h1>
        <SideBar />
      </div>
    );
  }
}
