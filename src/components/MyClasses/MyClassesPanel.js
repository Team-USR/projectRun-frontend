import React, { Component } from 'react';
import { GroupQuizzes } from './GroupQuizzes';

export default class MyClassesPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    // console.log(this.props.content);
    return (
      <div className="groupQuizzesWrapper">
        <h2>{this.props.content.classTitle}</h2>
        <GroupQuizzes
          quizzes={this.props.content.quizzes}
        />
      </div>
    );
  }
}
