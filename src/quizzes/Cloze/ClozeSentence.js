import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

export default function ClozeSentence(props) {
  const words = props.question.split(/\s/);
  if (!words[words.length - 1].match(/[a-zA-Z0-9]+\./)) {
    words.push('.');
  }

  const tooltip = <Tooltip id="tooltip">{props.hint || 'No hints!'}</Tooltip>;

  return (
    <li key={props.index}>
      {words.map(w => (w.match(/{\d}/) ?
      (<OverlayTrigger key={Math.floor(Math.random() * 10000)} placement="top" overlay={tooltip}>
        <input type="text" maxLength="12" />
      </OverlayTrigger>) : `${w} `))}
    </li>
  );
}

ClozeSentence.propTypes = {
  index: React.PropTypes.number.isRequired,
  question: React.PropTypes.string.isRequired,
  hint: React.PropTypes.string.isRequired,
};
