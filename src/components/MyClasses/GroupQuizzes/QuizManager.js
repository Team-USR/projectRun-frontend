import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';

export default class QuizManager extends Component {

  renderButton() {
    if (this.props.type === 'add') {
      return (
        <Button
          className="classQuizBtn"
          onClick={() => this.props.addQuiz(this.props.index)}
        >
          {this.props.title}
          <span className="glyphicon glyphicon-plus" />
        </Button>
      );
    } else if (this.props.type === 'remove') {
      return (
        <Button
          className="classQuizBtn"
          onClick={() => this.props.removeQuiz(this.props.index)}
        >
          {this.props.title}
          <span className="glyphicon glyphicon-remove" />
        </Button>
      );
    }
    return (null);
  }

  render() {
    return (
      <div className="quizManagerWrapper">
        { this.renderButton() }
      </div>
    );
  }
}

QuizManager.propTypes = {
  index: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  addQuiz: PropTypes.func,
  removeQuiz: PropTypes.func,
};

QuizManager.defaultProps = {
  addQuiz: null,
  removeQuiz: null,
};
