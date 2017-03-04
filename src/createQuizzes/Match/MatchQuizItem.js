import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';

export default function MatchQuizItem(props) {
  const quizID = `quizItem + ${props.id}`;
  return (
    <div className="quizItem" id={quizID} key={quizID}>
      <div className="itemIndex">
        <label htmlFor="item">{ props.index + 1 }</label>
      </div>
      <textarea
        id={props.id}
        disabled={props.reviewState || props.resultsState}
        name={props.leftTextareaName}
        className="itemTexarea leftTextarea"
        placeholder={props.leftTextareaPlaceholder}
        rows="3" cols="25"
        value={props.leftValue}
        onChange={e => props.onChange(e, props.index)}
      />
      <textarea
        id={props.id}
        disabled={props.reviewState || props.resultsState}
        name={props.rightTextareaName}
        className="itemTexarea rightTextarea"
        placeholder={props.rightTextareaPlaceHolder}
        rows="3" cols="25"
        value={props.rightValue}
        onChange={e => props.onChange(e, props.index)}
      />
      <div className="deleteMatchItemBtnContainer">
        <Button
          className="deleteMatchItemBtn"
          id={props.id}
          onClick={() => props.deleteMatchElement(props.index)}
        > X </Button>
      </div>
    </div>
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
