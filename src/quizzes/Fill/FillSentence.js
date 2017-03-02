import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

export default class FillSentence extends React.Component {

  constructor(props) {
    super(props);

    this.renderQuestion = this.renderQuestion.bind(this);
  }

  renderQuestion(num) {
    const words = this.props.question.split(/\s/);
    if (!words[words.length - 1].match(/[a-zA-Z0-9]+\./)) {
      words.push('.');
    }

    const tooltip = <Tooltip id="tooltip">{this.props.hint || 'No hints!'}</Tooltip>;

    return (
      <p>{`${num.toString()}. `}
        {words.map(w => (w.match(/{\d}/) ?
        (<OverlayTrigger placement="top" overlay={tooltip}>
          <input type="text" maxLength="12" />
        </OverlayTrigger>) : `${w} `))}
      </p>
    );
  }

  render() {
    return (
      <div>{this.renderQuestion(this.props.index)}</div>
    );
  }
}

FillSentence.propTypes = {
  index: React.PropTypes.number.isRequired,
  question: React.PropTypes.string.isRequired,
  hint: React.PropTypes.string.isRequired,
};
