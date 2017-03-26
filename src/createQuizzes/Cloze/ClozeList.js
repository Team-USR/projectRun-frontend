import React from 'react';
import { Button, Col } from 'react-bootstrap';

export default function ClozeList(props) {
  return (
    <Col md={12}>
      <ul className="cloze-sentences">
        {props.questions.map(q => (
          <div>
            <li style={{ paddingTop: 5 }} key={q.no}>
              <Col md={11}>
                <p className="text-center">{q.question}</p>
              </Col>
              <Col md={1}>
                <Button onClick={() => props.removeQuestion(q)}>x</Button>
              </Col>
            </li>
            <hr />
          </div>
        ))}
      </ul>
    </Col>
  );
}

ClozeList.propTypes = {
  questions: React.PropTypes.arrayOf(React.PropTypes.shape({
    no: React.PropTypes.number,
    question: React.PropTypes.string,
  })).isRequired,
};
