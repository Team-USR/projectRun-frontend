import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';
import { QuizManager } from './index';

export default class GroupQuizzes extends Component {

  renderQuizzes() {
    return this.props.quizzes.map(obj =>
      <li key={`group_quiz_${obj.quizId}`}>
        <QuizManager
          quizId={obj.quizId}
          value={obj.quizTitle}
          removeQuiz={id => this.props.handleRemoveQuizClick(id)}
        />
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
        <Button onClick={this.props.handleAddQuizClick}> Add Quiz </Button>
      </div>
    );
  }
}

GroupQuizzes.propTypes = {
  quizzes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleAddQuizClick: PropTypes.func.isRequired,
  handleRemoveQuizClick: PropTypes.func.isRequired,
};
