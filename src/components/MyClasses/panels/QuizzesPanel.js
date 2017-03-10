import React, { PropTypes, Component } from 'react';
import { Button, Col } from 'react-bootstrap';
import { QuizManager } from '../GroupQuizzes';

export default class QuizzesPanel extends Component {

  constructor() {
    super();
    this.state = {
      selectedQuizzes: [],
      availableQuizzes: [],
    };
  }

  componentWillMount() {
    this.setState({
      selectedQuizzes: this.props.quizzes,
      availableQuizzes: this.getAvailableQuizzes(),
    });
  }

  getAvailableQuizzes() {
    const newQuizzesObj = {};
    this.props.quizzes.map((obj) => {
      newQuizzesObj[obj.quizId] = obj.quizTitle;
      return 0;
    });

    return this.props.allQuizzes.filter((obj) => {
      if (!newQuizzesObj[obj.quizId]) {
        return true;
      }
      return false;
    });
  }

  addQuiz(index) {
    const newQuizzesObj = this.state.selectedQuizzes;
    newQuizzesObj.push(this.state.availableQuizzes[index]);

    const newAvailableQuizzesObj = this.state.availableQuizzes;
    newAvailableQuizzesObj.splice(index, 1);

    this.setState({
      selectedQuizzes: newQuizzesObj,
      availableQuizzes: newAvailableQuizzesObj,
    });
  }
  removeQuiz(index) {
    const newAvailableQuizzesObj = this.state.availableQuizzes;
    newAvailableQuizzesObj.push(this.state.selectedQuizzes[index]);

    const newQuizzesObj = this.state.selectedQuizzes;
    newQuizzesObj.splice(index, 1);

    this.setState({
      selectedQuizzes: newQuizzesObj,
      availableQuizzes: newAvailableQuizzesObj,
    });
  }

  renderSelectedQuizzes() {
    if (this.state.selectedQuizzes.length === 0) {
      return <h4>There are no quizzes assigned to this class!</h4>;
    }
    return this.state.selectedQuizzes.map((obj, index) =>
      <li key={`class_selected_quiz_${obj.quizId}`}>
        <QuizManager
          type={'remove'}
          quizId={obj.quizId}
          index={index}
          value={obj.quizTitle}
          removeQuiz={id => this.removeQuiz(id)}
        />
      </li>,
    );
  }

  renderAvailableQuizzes() {
    if (this.state.availableQuizzes.length === 0) {
      return <h4>All your quizzes have been assigned!</h4>;
    }
    return this.state.availableQuizzes.map((obj, index) =>
      <li key={`class_available_quiz_${obj.quizId}`}>
        <QuizManager
          type={'add'}
          quizId={obj.quizId}
          index={index}
          value={obj.quizTitle}
          addQuiz={id => this.addQuiz(id)}
        />
      </li>,
    );
  }

  render() {
    return (
      <div className="quizPanelWrapper">
        <Col md={12}>
          <h3>Manage assigned quizzes</h3>
          <hr />
        </Col>
        <Col md={12} className="quizzesList">
          <Col md={6}>
            <ul>
              { this.renderSelectedQuizzes() }
            </ul>
          </Col>
          <Col md={6}>
            <ul>
              { this.renderAvailableQuizzes() }
            </ul>
          </Col>
        </Col>
        <Col md={12}>
          <hr />
          <Button
            onClick={() =>
              this.props.handleSaveAssignedQuizzes(this.state.selectedQuizzes)}
          > Save </Button>
        </Col>
      </div>
    );
  }
}

QuizzesPanel.propTypes = {
  quizzes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  allQuizzes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleSaveAssignedQuizzes: PropTypes.func.isRequired,
};
