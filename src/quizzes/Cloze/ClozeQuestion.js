import React from 'react';
import { ClozeSentence } from './index';


export default function ClozeQuestion(props) {
  return (
    <div>
      <p>{props.index}. {props.req}</p>
      <ol>
        {props.questions.map(q =>
          <ClozeSentence key={q.no} index={q.no} question={q.question} hint={q.hint || ''} />)
        }
      </ol>
    </div>
  );
}

ClozeQuestion.propTypes = {
  index: React.PropTypes.number.isRequired,
  req: React.PropTypes.string.isRequired,
  questions: React.PropTypes.arrayOf(React.PropTypes.shape({
    no: React.PropTypes.number,
    question: React.PropTypes.string,
    hint: React.PropTypes.string,
  })).isRequired,
};
