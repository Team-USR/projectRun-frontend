import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';

export default class GroupQuizzes extends Component {

  renderQuizzes() {
    return this.props.quizzes.map(obj =>
      <li key={`group_quiz_${obj.quizId}`}>
        <span><b> {obj.quizTitle} </b></span>
      </li>,
    );
  }

  render() {
    return (
      <div className="groupQuizzesWrapper">
        <br />
        <h1>Quizzes</h1>
        <ul>
          { this.renderQuizzes() }
        </ul>
        <Button onClick={this.props.handleManageQuizzesFromClass}> Manage Section </Button>
      </div>
    );
  }
}

GroupQuizzes.propTypes = {
  quizzes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleManageQuizzesFromClass: PropTypes.func.isRequired,
};
