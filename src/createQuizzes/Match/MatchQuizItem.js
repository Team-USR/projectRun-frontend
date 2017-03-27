import React, { PropTypes } from 'react';
import { Button, Col } from 'react-bootstrap';

export default function MatchQuizItem(props) {
  const quizID = `quizItem + ${props.id}`;
  return (

    <Col md={12} className="quizItem" id={quizID} key={quizID}>
      <Col md={1}>
        <div className="itemIndex">
          <label htmlFor="item">{ props.index + 1 }</label>
        </div>
      </Col>
      <Col md={5}>
        <textarea
          id={props.id}
          disabled={props.reviewState || props.resultsState}
          name={props.leftTextareaName}
          className="itemTexarea leftTextarea form-control"
          placeholder={props.leftTextareaPlaceholder}
          value={props.leftValue}
          onChange={e => props.onChange(e, props.index)}
        />
      </Col>
      <Col md={5}>
        <textarea
          id={props.id}
          disabled={props.reviewState || props.resultsState}
          name={props.rightTextareaName}
          className="itemTexarea rightTextarea form-control"
          placeholder={props.rightTextareaPlaceHolder}
          value={props.rightValue}
          onChange={e => props.onChange(e, props.index)}
        />
      </Col>
      <Col md={1}>
        <div className="deleteMatchItemBtnContainer">
          <Button
            className="deleteMatchItemBtn"
            id={props.id}
            onClick={() => props.deleteMatchElement(props.index)}
          >
            <i className="fa fa-times" aria-hidden="true" />
          </Button>
        </div>
      </Col>
    </Col>
  );
}

MatchQuizItem.propTypes = {
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  leftTextareaName: PropTypes.string.isRequired,
  rightTextareaName: PropTypes.string.isRequired,
  reviewState: PropTypes.bool.isRequired,
  resultsState: PropTypes.bool.isRequired,
  leftValue: PropTypes.string.isRequired,
  rightValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  deleteMatchElement: PropTypes.func.isRequired,
  leftTextareaPlaceholder: PropTypes.string.isRequired,
  rightTextareaPlaceHolder: PropTypes.string.isRequired,
};
