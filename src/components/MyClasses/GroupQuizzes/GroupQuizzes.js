import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';
import { TEACHER } from '../../../constants';

export default class GroupQuizzes extends Component {

  renderQuizzes() {
    if (this.props.quizzes.length === 0) {
      return <h4>There are no quizzes assigned to this class!</h4>;
    }
    return this.props.quizzes.map(obj =>
      <li key={`group_quiz_${obj.id}`}>
        <span><b> {obj.title} </b></span>
      </li>,
    );
  }

  renderManageButton() {
    if (this.props.userType === TEACHER) {
      return <Button onClick={this.props.handleManageQuizzesFromClass}> Manage Section </Button>;
    }
    return (null);
  }

  render() {
    return (
      <div className="groupQuizzesWrapper">
        <h1>Quizzes</h1>
        <ul>
          { this.renderQuizzes() }
          { this.renderManageButton() }
        </ul>
      </div>
    );
  }
}

GroupQuizzes.propTypes = {
  userType: PropTypes.string.isRequired,
  quizzes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleManageQuizzesFromClass: PropTypes.func,
};

GroupQuizzes.defaultProps = {
  handleManageQuizzesFromClass: null,
};
