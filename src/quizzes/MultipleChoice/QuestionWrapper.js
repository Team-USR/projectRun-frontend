import React, { Component, PropTypes } from 'react';
import { Question, Choice, Answer } from './index';

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
    let defaultAnswer = null;
    if (this.props.creatorAnswers !== null && this.props.creatorAnswers[indexQ] != null) {
    //  console.log("true");
      defaultAnswer = this.props.creatorAnswers[indexQ].is_correct;
    }
    return (
      <Choice
        value={indexQ} choiceText={choices.answer}
        id={choices.id}
        key={choices.id}
        inReview={inReview}
        defaultValue={defaultAnswer}
        callbackParent={(newState) => { this.onChildChanged(newState, choices.id, indexQ); }}
      />
    );
  }
  renderAnswers(choiceID) {
    if (this.props.inResultsState) {
      const tempIndex = this.props.correctAnswer.correct_answers.indexOf(choiceID);
      return (
        <Answer
          key={this.props.index}
          correctAnswer={this.props.correctAnswer.correct_answers[tempIndex]}
        />
      );
    }
    return ('');
  }
  renderFinalAnswer() {
    if (this.props.inResultsState && this.props.correctAnswer) {
      return (
        <h3>Answer: {this.props.correctAnswer.correct.toString()}</h3>
      );
    }
    return ('');
  }
  render() {
    const { question, index, inReview } = this.props;
    this.answerClass = '';

    if (this.props.inResultsState) {
      const correctAnswer = this.props.correctAnswer;
      if (correctAnswer && correctAnswer.correct) {
        this.answerClass = 'correctAnswerWrapper';
      } else {
        this.answerClass = 'wrongAnswerWrapper';
      }
    }

    const styleClasses = `multipleChoiceContainer ${this.answerClass}`;

    return (
      <div className={styleClasses}>
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
  callbackParent: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  inReview: PropTypes.bool.isRequired,
  inResultsState: PropTypes.bool.isRequired,
  question: PropTypes.shape({
    id: PropTypes.number.isRequired,
    question: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    answers: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      answer: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  correctAnswer: PropTypes.shape({
    correct: PropTypes.bool,
    correct_answers: PropTypes.arrayOf(PropTypes.number),
  }),
  creatorAnswers: PropTypes.arrayOf(PropTypes.shape({
    is_correct: PropTypes.bool,
  })),
};

QuestionWrapper.defaultProps = {
  correctAnswer: {
    correct: false,
    correct_answers: [],
  },
  creatorAnswers: [],
  is_correct: false,
};

export default QuestionWrapper;
