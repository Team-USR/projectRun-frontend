import React from 'react';
import { FillSentence } from './index';


export default function FillQuestion(props) {
  return (
    <div>
      <p>{props.index}. {props.req}</p>
      {props.questions.map(q =>
        <FillSentence key={q.no} index={q.no} question={q.question} hint={q.hint || ''} />)
      }
    </div>
  );
}

FillQuestion.propTypes = {
  index: React.PropTypes.number.isRequired,
  req: React.PropTypes.string.isRequired,
  questions: React.PropTypes.arrayOf(React.PropTypes.shape({
    no: React.PropTypes.number,
    question: React.PropTypes.string,
    hint: React.PropTypes.string,
  })).isRequired,
};
