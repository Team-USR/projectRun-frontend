import React, { Component } from 'react';
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
  getMyAnswer(index, myAnswers, answerIndex) {
    if (myAnswers[index] && myAnswers[this.index][answerIndex]) {
      return true;
    }
    return false;
  }
  renderChoices(indexQ, choices, inReview) {
    return (
      <Choice
        value={indexQ} choiceText={choices.answer}
        id={choices.id}
        key={choices.id}
        initialChecked={this.state.checked}
        inReview={inReview}
        callbackParent={(newState) => { this.onChildChanged(newState, choices.id, indexQ); }}
      />
    );
  }
  renderAnswers(inResultsState, answer, index, myAnswers, answerIndex) {
    if (inResultsState) {
      return (
        <Answer
          key={answerIndex}
          myAnswer={this.getMyAnswer(index, myAnswers, answerIndex)}
          correctAnswer={answer.correct}
          feedback={answer.choiceFeedback}
        />
      );
    }
    return ('');
  }
  render() {
    const { question, index, inReview } = this.props;
    return (
      <div className="questionWrapper">
        <div className="questionPanel">
          <Question question={question.question} index={index} key={question.id} />
        </div>
        <div style={styles.choiceContainer}>
          <div style={styles.choicePanel}>
            <form>
              { question.answers.map((choice, indexQ) =>
            this.renderChoices(indexQ, choice, inReview))}
            </form>
          </div>
        </div>
      </div>
    );
  }
}
QuestionWrapper.propTypes = {
  callbackParent: React.PropTypes.func.isRequired,
  index: React.PropTypes.number.isRequired,
  inReview: React.PropTypes.bool.isRequired,
};
export default QuestionWrapper;
