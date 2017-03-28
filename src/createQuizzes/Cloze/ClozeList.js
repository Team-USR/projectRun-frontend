import React from 'react';
import { Button, Col } from 'react-bootstrap';

/**
 * List component for rendering Fill in the gaps sentences
 * @param {Object} props inherited properties
 */
export default function ClozeList(props) {
  /**
   * Returns the list component
   * @return {Object}
   */
  return (
    <Col md={12}>
      <ul className="cloze-sentences">
        {props.questions.map(q => (
          <div key={q.no}>
            <li style={{ paddingTop: 5 }}>
              <Col md={10}>
                <p className="text-center">{q.question}</p>
              </Col>
              <Col md={2}>
                <Button style={{ marginLeft: '13px' }} onClick={() => props.removeQuestion(q)}>
                  <i className="fa fa-times" style={{ color: '#d10c0f' }} aria-hidden="true" />
                </Button>
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
