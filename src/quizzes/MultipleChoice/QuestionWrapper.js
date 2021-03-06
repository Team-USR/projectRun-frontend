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
/*
  Wrapper component for the multiple choice question. Contains the question and the answers fields.
*/
class QuestionWrapper extends Component {
  /*
  Constructor that contains the initial state.
  */
  constructor() {
    super();
    this.state = { results: [] };
  }
  /*
    Updates the current state and the upper component (parent)
    when the child components are changed
  */
  onChildChanged(newState, id, index) {
    let newArray = this.state.results;
    if (newState === true) newArray.push(id);
    else {
      newArray = newArray.filter(item => item !== id);
    }
    this.setState({ results: newArray });
    this.props.callbackParent(newArray, index);
  }
  /*
    Renders a choice component
  */
  renderChoices(indexQ, choices, inReview) {
    let defaultAnswer = null;
    if (this.props.creatorAnswers !== null && this.props.creatorAnswers[indexQ] != null) {
      defaultAnswer = this.props.creatorAnswers[indexQ].is_correct;
    }
    if (this.props.sessionAnswers !== null && this.props.sessionAnswers !== undefined) {
      if (this.props.sessionAnswers.answer_ids !== null
        && this.props.sessionAnswers.answer_ids !== undefined) {
        const ids = this.props.sessionAnswers.answer_ids;
        ids.map((element) => {
          if (element === choices.id) {
            defaultAnswer = true;
          }
          return (null);
        });
      }
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
  /*
  Renders an answer to the screen given the choice id.
  */
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
  /*
    Main render function
  */
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

    const styleClasses = `cardSection ${this.answerClass}`;

    return (
      <div className={styleClasses}>
        <div className="questionPanel">
          <Question question={question.question} index={index} key={question.id} />
          <h5>Points: {question.points}</h5>
        </div>
        <div style={styles.choiceContainer}>
          <div className="choicesListMultipleChoice">
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
  sessionAnswers: PropTypes.shape({
    answer_ids: PropTypes.arrayOf(PropTypes.number),
  }),
};

QuestionWrapper.defaultProps = {
  correctAnswer: {
    correct: false,
    correct_answers: [],
  },
  creatorAnswers: [],
  is_correct: false,
  sessionAnswers: {
    answer_ids: [],
  },
};

export default QuestionWrapper;
