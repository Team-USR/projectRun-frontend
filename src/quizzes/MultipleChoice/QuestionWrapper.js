import React, { Component } from 'react';
import { Question, Choice, Answer } from './index';

import '../../style/MultipleChoice.css';

class QuestionWrapper extends Component {
  constructor() {
    super();
    this.state = { results: [] };
  }
  onChildChanged(newState, index) {
  const newArray = this.state.results.slice();
  newArray[index] = newState;
  this.setState({ results: newArray });
  this.props.callbackParent(newArray, index);
  }
  getMyAnswer(index, myAnswers, answerIndex) {
      if (myAnswers[index] && myAnswers[index][answerIndex]) {
        return true;
      }
      return false;
  }
  renderChoices(indexQ, choices, inReview) {
      return (
        <Choice
          value={indexQ} choiceText={choices.answer}
          key={choices.id}
          initialChecked={this.state.checked}
          inReview={inReview}
          callbackParent={(newState) => { this.onChildChanged(newState, indexQ); }}
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
    }

  render() {
  const {
     objectQuestion, id, index, inReview, inResultsState, correctAnswers, myAnswers } = this.props;
  return (
    <div className="questionWrapper">
      <div className="questionPanel">
        <Question question={objectQuestion.question} index={index} key={id} />
      </div>

      <div style={styles.choiceContainer}>
      <div style={styles.choicePanel}>
        <form>
          { objectQuestion.answers.map((choice, indexQ) =>
            this.renderChoices(indexQ, choice, inReview))}
        </form>
      </div>

      <div style={styles.answersPanel}>
      { correctAnswers.map((answer, answerIndex) =>
        this.renderAnswers(inResultsState, answer, index, myAnswers, answerIndex))}
      </div>
      </div>
    </div>
  );
}
}
const styles = {
  choicePanel: {
    width: 150,
  },
  answersPanel: {

  },
  choiceContainer: {
    padding: 10
  }

};

export { QuestionWrapper };
