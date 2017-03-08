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
          {this.props.value}
          <span className="glyphicon glyphicon-plus" />
        </Button>
      );
    }

    return (
      <Button
        className="classQuizBtn"
        onClick={() => this.props.removeQuiz(this.props.index)}
      >
        {this.props.value}
        <span className="glyphicon glyphicon-remove" />
      </Button>
    );
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
  value: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  addQuiz: PropTypes.func,
  removeQuiz: PropTypes.func,
};

QuizManager.defaultProps = {
  addQuiz: null,
  removeQuiz: null,
};
