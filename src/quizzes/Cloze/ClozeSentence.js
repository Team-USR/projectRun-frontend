import React from 'react';
import { Tooltip, OverlayTrigger, ListGroupItem } from 'react-bootstrap';
import { GAP_MATCHER } from '../../constants';
import { stripGapNo } from '../../helpers/Cloze';

function addPeriod(words) {
  const last = words.pop();
  if (!last.match(GAP_MATCHER)) {
    words.push(last);
    return words;
  }
  words.push(last);
  words.push('.');
  return words;
}

export default class ClozeSentence extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      studentReview: props.studentReview,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ studentReview: nextProps.studentReview });
  }

  renderReview() {
    const words = addPeriod(this.props.sentence.split(/\s/));
    const hintsCopy = this.props.hints.reverse();
    const gapsCopy = this.props.gaps.reverse();

    return (
      words.map((word) => {
        if (!word.match(GAP_MATCHER)) return `${word} `;
        const tooltip = <Tooltip id={`${word}`} key={`tooltip-${word}-${hintsCopy.length}`}>{hintsCopy.pop() || 'No hints!'}</Tooltip>;
        return (
          <OverlayTrigger id="tooltip" key={`overlay-${word}-${hintsCopy.length}`} placement="top" overlay={tooltip}>
            <input
              key={`input-${word}-${hintsCopy.length}`}
              className="cloze-gap"
              type="text" maxLength="12"
              value={gapsCopy.pop()}
              readOnly={this.props.reviewer}
            />
          </OverlayTrigger>
        );
      })
    );
  }

  renderView() {
    const words = addPeriod(this.props.sentence.split(/\s/));
    const hintsCopy = this.props.hints.map(x => x).reverse();

    return (
      words.map((word) => {
        if (!word.match(GAP_MATCHER)) return `${word} `;
        const tooltip = <Tooltip id={word} key={`tooltip-${word}-${hintsCopy.length}`}>{hintsCopy.pop() || 'No hint!'}</Tooltip>;
        const gapNo = stripGapNo(word);
        return (
          <OverlayTrigger id="tooltip" key={`overlay-${word}-${hintsCopy.length}`} placement="top" overlay={tooltip}>
            <input
              id={gapNo}
              key={`input-${word}-${hintsCopy.length}`}
              className="cloze-gap"
              type="text"
              maxLength="12"
              value={this.props.sessionAnswers[gapNo - 1]}
              onChange={e => this.props.handleChange(e)}
              readOnly={this.state.studentReview}
            />
          </OverlayTrigger>
        );
      })
    );
  }

  render() {
    return (
      <ListGroupItem key={this.props.index} style={{ marginTop: '8px' }}>
        {this.props.reviewer ? this.renderReview() : this.renderView()}
      </ListGroupItem>
    );
  }
}

ClozeSentence.propTypes = {
  index: React.PropTypes.number.isRequired,
  sentence: React.PropTypes.string.isRequired,
  hints: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  gaps: React.PropTypes.arrayOf(React.PropTypes.string),
  sessionAnswers: React.PropTypes.arrayOf(React.PropTypes.string),
  handleChange: React.PropTypes.func,
  reviewer: React.PropTypes.bool,
  studentReview: React.PropTypes.bool,
};

ClozeSentence.defaultProps = {
  gaps: [],
  sessionAnswers: [],
  reviewer: true,
  studentReview: false,
  handleChange: () => {},
};
