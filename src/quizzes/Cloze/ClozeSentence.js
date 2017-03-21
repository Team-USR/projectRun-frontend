import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { GAP_MATCHER } from '../../constants';

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

  renderReview() {
    const words = addPeriod(this.props.sentence.split(/\s/));
    const hintsCopy = this.props.hints;
    const gapsCopy = this.props.gaps;

    return (
      words.map((word) => {
        if (!word.match(GAP_MATCHER)) return `${word} `;
        const tooltip = <Tooltip key={`tooltip-${word}-${hintsCopy.length}`}>{hintsCopy.pop() || 'No hints!'}</Tooltip>;
        return (
          <OverlayTrigger key={`overlay-${word}-${hintsCopy.length}`} placement="top" overlay={tooltip}>
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
    const hintsCopy = this.props.hints;

    return (
      words.map((word, ind) => {
        if (!word.match(GAP_MATCHER)) return `${word} `;
        const tooltip = <Tooltip id={word} key={`tooltip-${word}-${hintsCopy.length}`}>{hintsCopy.pop() || 'No hint!'}</Tooltip>;
        return (
          <OverlayTrigger key={`overlay-${word}-${hintsCopy.length}`} placement="top" overlay={tooltip}>
            <input
              id={word.split(/[{}]/)[1]}
              key={`input-${word}-${hintsCopy.length}`}
              className="cloze-gap"
              type="text"
              maxLength="12"
              value={this.props.sessionAnswers[ind]}
              onChange={e => this.props.handleChange(e)}
            />
          </OverlayTrigger>
        );
      })
    );
  }

  render() {
    return (
      <li key={this.props.index} style={{ marginTop: '8px' }}>
        {this.props.reviewer ? this.renderReview() : this.renderView()}
      </li>
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
};

ClozeSentence.defaultProps = {
  gaps: [],
  sessionAnswers: [],
  reviewer: true,
  handleChange: () => {},
};
