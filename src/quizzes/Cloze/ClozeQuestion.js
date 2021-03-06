import React from 'react';
import { ClozeSentence } from './index';
import { getNOfGaps } from '../../helpers/Cloze';

/**
 * Component to be rendered in QuizViewer
 * @type {Object}
 */
export default class ClozeQuestion extends React.Component {
  /**
   * Initializes the state
   * @param  {Object} props inherited properties
   * @return {undefined}
   */
  constructor(props) {
    super(props);
    const gaps = props.sentences.map(sentence => sentence.gaps.map(() => ''));
    this.state = {
      answers: props.sessionAnswers.length ? props.sessionAnswers : [].concat(...gaps),
      resultsState: props.resultsState,
      correctAnswer: props.resultsState ? props.correctAnswer : {},
    };

    this.handleChange = this.handleChange.bind(this);
  }
  /**
   * Update the QuizViewer to QuizReviewer if user submitted the quiz
   * @param  {Object} nextProps usual props but with right answers on top
   * @return {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.resultsState) {
      const copy = nextProps.correctAnswer;
      this.setState({ correctAnswer: copy });
    }
    this.setState({ resultsState: nextProps.resultsState });
  }
  /**
   * Updates the if the users changes one of the answers
   * @param  {event} e event
   * @return {undefined}
   */
  handleChange(e) {
    const newAnswers = this.state.answers;
    newAnswers[e.target.id - 1] = e.target.value.trim();
    this.props.callbackParent(newAnswers);
    this.setState({ answers: newAnswers });
  }
  /**
   * Renders the review mode for the question
   * to be used by teachers in QuizEditor
   * @return {Object}
   */
  renderReview() {
    return (
      this.props.sentences.map((sentence, ind) =>
        <ClozeSentence
          key={sentence.text}
          index={ind}
          sentence={sentence.text}
          gaps={sentence.gaps.map(gap => gap.gap)}
          hints={sentence.gaps.map(gap => gap.hint)}
          handleChange={this.handleChange}
        />,
      )
    );
  }
  /**
   * Renders the view mode for the question, to be solved
   * by students or to display their result
   * @return {Object}
   */
  renderView() {
    let correctGapsCopy = [];
    if (this.props.resultsState && Object.keys(this.props.correctAnswer).length > 0) {
      correctGapsCopy = this.props.correctAnswer.correct_gaps.slice();
    }

    return (
      this.props.sentences.map((sentence, ind) =>
        <ClozeSentence
          key={sentence.text}
          index={ind}
          sentence={sentence.text}
          hints={this.props.resultsState ?
            correctGapsCopy.splice(0, getNOfGaps(sentence.text))
            : sentence.gaps.map(gap => gap.hint)}
          sessionAnswers={this.props.sessionAnswers}
          reviewer={false}
          handleChange={this.handleChange}
          studentReview={this.props.studentReview}
          resultsState={this.props.resultsState}
        />,
      )
    );
  }
  /**
   * Renders the question card
   * @return {Object}
   */
  render() {
    let validationClass = '';
    if (this.state.resultsState) {
      validationClass = this.state.correctAnswer.correct ?
        'correctAnswerWrapper' : 'wrongAnswerWrapper';
    }
    return (
      <div className={`cardSection ${validationClass}`} >
        <div className="questionPanel">
          <h3>{this.props.index + 1}. {this.props.request}</h3>
          <h5>Points: {this.props.points}</h5>
        </div>
        <ul>
          {this.props.reviewer ? this.renderReview() : this.renderView()}
        </ul>
      </div>
    );
  }
}

ClozeQuestion.propTypes = {
  index: React.PropTypes.number.isRequired,
  request: React.PropTypes.string.isRequired,
  points: React.PropTypes.number,
  sentences: React.PropTypes.arrayOf(React.PropTypes.shape({
    text: React.PropTypes.string,
    gaps: React.PropTypes.arrayOf(React.PropTypes.shape({
      gap: React.PropTypes.string,
      hint: React.PropTypes.string,
    })),
  })).isRequired,
  sessionAnswers: React.PropTypes.arrayOf(React.PropTypes.string),
  reviewer: React.PropTypes.bool,
  studentReview: React.PropTypes.bool,
  resultsState: React.PropTypes.bool,
  callbackParent: React.PropTypes.func,
  correctAnswer: React.PropTypes.shape({
    id: React.PropTypes.number,
    correct: React.PropTypes.bool,
    correct_gaps: React.PropTypes.arrayOf(React.PropTypes.string),
  }),
};

ClozeQuestion.defaultProps = {
  gaps: [],
  points: 0,
  sessionAnswers: [],
  reviewer: true,
  studentReview: false,
  resultsState: false,
  callbackParent: () => {},
  correctAnswer: {},
};
