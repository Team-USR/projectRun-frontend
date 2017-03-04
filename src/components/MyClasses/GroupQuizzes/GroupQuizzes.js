import React, { Component } from 'react';
import { QuizManager } from './index';

export default class MyClassesPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  renderQuizManager(value) {
    console.log(value);
    return <QuizManager value={value} />;
  }

  render() {
    console.log(this.props.quizzes);
    return (
      <div className="groupQuizzesWrapper">
        <ul>
          { this.props.quizzes.map(obj => this.renderQuizManager(obj.quizTitle)) }
        </ul>
      </div>
    );
  }
}
