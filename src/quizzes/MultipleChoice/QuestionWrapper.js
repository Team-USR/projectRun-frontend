import React, { Component, PropTypes } from 'react';
import { Question, Choice, Answer } from './index';
import '../../style/MultipleChoice.css';

const styles = {
  choicePanel: {
    width: 150,
  },
  choiceContainer: {
    padding: 10,
  },

};
class QuestionWrapper extends Component {
  constructor() {
    super();
    this.state = { results: [] };
  }
  onChildChanged(newState, id, index) {
    const newArray = this.state.results.slice();
    if (newState === true) newArray.push(id);
    else newArray.splice(index, 1);
    this.setState({ results: newArray });
    this.props.callbackParent(newArray, index);
  }
  renderChoices(indexQ, choices, inReview) {
    return (
      <Choice
        value={indexQ} choiceText={choices.answer}
        id={choices.id}
        key={choices.id}
        inReview={inReview}
        callbackParent={(newState) => { this.onChildChanged(newState, choices.id, indexQ); }}
      />
      /*  this.renderAnswers(choices.id) */
    );
  }
  renderAnswers(choiceID) {
    if (this.props.inResultsState) {
      const tempIndex = this.props.correctAnswer[0].correct_answers.indexOf(choiceID)
        return (
          <Answer
            key={this.props.index}
            correctAnswer={this.props.correctAnswer[0].correct_answers[tempIndex]}
            feedback={'feedback'}
          />
        );
    }
    return ('');
  }
  renderFinalAnswer() {
    if (this.props.inResultsState && this.props.correctAnswer[0]) {
      return (
        <h3>Answer: {this.props.correctAnswer[0].correct.toString()}</h3>
      );
    }
    return ('');
  }
  render() {
    const { question, index, inReview } = this.props;
    return (
      <div className="multipleChoiceContainer">
        <div className="questionPanel">
          <Question question={question.question} index={index} key={question.id} />
        </div>
        <div style={styles.choiceContainer}>
          <div style={styles.choicePanel}>
            <form>
              { question.answers.map((choice, indexQ) =>
                this.renderChoices(indexQ, choice, inReview))}
              {this.renderFinalAnswer()}
            </form>
          </div>
        </div>
      </div>
    );
  }
}
QuestionWrapper.propTypes = {
  callbackParent: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  inReview: PropTypes.bool.isRequired,
  question: PropTypes.shape({
    id: PropTypes.number.isRequired,
    question: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    answers: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      answer: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
};
export default QuestionWrapper;
