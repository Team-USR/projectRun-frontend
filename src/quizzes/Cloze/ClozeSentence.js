import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { GAP_MATCHER } from '../../constants';

export default class ClozeSentence extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      resultsState: true,
      reviewState: false,
    };
  }

  render() {
    const words = this.props.question.split(/\s/);
    const gapsCopy = this.props.gaps;
    if (!words[words.length - 1].match(/[A-zÀ-ÿ0-9]+\./)) {
      words.push('.');
    }

    return (
      <li key={this.props.index}>
        {words.map((w) => {
          if (!w.match(GAP_MATCHER)) {
            return `${w} `;
          }
          const gap = gapsCopy.slice(0, 1)[0];
          const tooltip = <Tooltip id={`tooltip-${gap.id}`}>{gap.hint.hint_text || 'No hints!'}</Tooltip>;
          return (
            <OverlayTrigger key={`gap-${gap.id}`} placement="top" overlay={tooltip}>
              <input type="text" maxLength="12" value={this.state.resultsState ? gap.gap_text : ''} readOnly={this.state.resultsState} />
            </OverlayTrigger>
          );
        })}
      </li>
    );
  }
}

ClozeSentence.propTypes = {
  index: React.PropTypes.number.isRequired,
  question: React.PropTypes.string.isRequired,
  gaps: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.number,
    gap_text: React.PropTypes.string,
    hint: React.PropTypes.shape({
      id: React.PropTypes.number,
      hint_text: React.PropTypes.string,
    }),
  })).isRequired,
};
