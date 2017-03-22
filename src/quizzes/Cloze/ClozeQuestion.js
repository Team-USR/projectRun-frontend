import React from 'react';
import { ClozeSentence } from './index';


export default class ClozeQuestion extends React.Component {

  constructor(props) {
    super(props);
    const gaps = props.sentences.map(sentence => sentence.gaps.map(() => ''));
    this.state = {
      answers: props.sessionAnswers.length ? props.sessionAnswers : [].concat(...gaps),
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const newAnswers = this.state.answers;
    newAnswers[e.target.id - 1] = e.target.value;
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
        <ol>
          {this.props.reviewer ? this.renderReview() : this.renderView()}
        </ol>
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
  callbackParent: React.PropTypes.func,
};

ClozeQuestion.defaultProps = {
  gaps: [],
  sessionAnswers: [],
  reviewer: true,
  studentReview: false,
  callbackParent: () => {},
};
