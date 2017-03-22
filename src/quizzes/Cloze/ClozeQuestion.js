import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { ClozeSentence } from './index';


export default class ClozeQuestion extends React.Component {

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

  componentWillReceiveProps(nextProps) {
    if (nextProps.resultsState) {
      const copy = nextProps.correctAnswer;
      this.setState({ correctAnswer: copy });
    }
    this.setState({ resultsState: nextProps.resultsState });
  }

  answersState() {
    if (this.state.correctAnswer.correct) return 'green';
    const matches = this.state.correctAnswer.filter((gap, ind) =>
      gap !== this.state.answers[ind]);
    if (matches.length === 0) return 'red';
    return 'orange';
  }

  handleChange(e) {
    const newAnswers = this.state.answers;
    newAnswers[e.target.id - 1] = e.target.value.trim();
    this.props.callbackParent(newAnswers);
    this.setState({ answers: newAnswers });
  }

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

  renderView() {
    return (
      this.props.sentences.map((sentence, ind) =>
        <ClozeSentence
          key={sentence.text}
          index={ind}
          sentence={sentence.text}
          hints={sentence.gaps.map(gap => gap.hint)}
          sessionAnswers={this.props.sessionAnswers}
          reviewer={false}
          handleChange={this.handleChange}
          studentReview={this.props.studentReview}
          resultsState={this.props.resultsState}
        />,
      )
    );
  }

  render() {
    return (
      <div className="clozeQuizContainer">
        <h3 className="questionPanel">
          {this.props.index}. {this.props.request}
        </h3>
        <ListGroup style={this.state.resultsState ? { color: this.answersState() } : {}}>
          {this.props.reviewer ? this.renderReview() : this.renderView()}
        </ListGroup>
      </div>
    );
  }
}

ClozeQuestion.propTypes = {
  index: React.PropTypes.number.isRequired,
  request: React.PropTypes.string.isRequired,
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
  sessionAnswers: [],
  reviewer: true,
  studentReview: false,
  resultsState: false,
  callbackParent: () => {},
  correctAnswer: {},
};
