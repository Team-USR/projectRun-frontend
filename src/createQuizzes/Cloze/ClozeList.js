import React from 'react';
import { Button } from 'react-bootstrap';

export default function ClozeList(props) {
  const qz = props.questions.map(q => <div><p>{q.no}. {q.question}</p><Button>x</Button></div>);
  return qz;
}
