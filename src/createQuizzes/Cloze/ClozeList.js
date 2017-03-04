import React from 'react';
import { Button } from 'react-bootstrap';

export default function ClozeList(props) {
  return (
    <ol>
      {props.questions.map(q => (
        <li key={q.no}>{q.question}
          <Button onClick={() => props.removeQuestion(q)}>x</Button>
        </li>
      ))}
    </ol>
  );
}

ClozeList.propTypes = {
  questions: React.PropTypes.arrayOf(React.PropTypes.shape({
    no: React.PropTypes.number,
    question: React.PropTypes.string,
  })).isRequired,
};
