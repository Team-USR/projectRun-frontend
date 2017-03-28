import React, { PropTypes } from 'react';
import { Col } from 'react-bootstrap';

let answers = [];
let leftElements = [];
let rightElements = [];

/**
* Function used for displaying the elements from the left Column
* @param {Object} props  The properties from its parent
* @return {Object} A Component containing an left Item Text
*/
export default function MatchLeftElement(props) {
  return (
    <div className="matchLeftElementWrapper">
      <Col md={12} className="matchLeftElement">
        <div className="leftText"> {props.answer} </div>
      </Col>
    </div>
  );
}

/**
* This function is called when the user selects an option from dropdown
* It updates the 'answer' array with the selected options and updates
* also the answers from its parent state
* @param {Event, Object} e, props  The Click event and the Properties
*/
function onChange(e, props) {
  const target = e.nativeEvent.target;

  // nth Option inside a Select tag
  const indexOfOption = target.selectedIndex;
  const selectedOptionID = target[indexOfOption].id;

  // nth Select tag
  const indexOfElement = target.id;
  const leftMatchID = leftElements[indexOfElement].id;

  answers[indexOfElement] =
    { left_choice_id: leftMatchID, right_choice_id: selectedOptionID };
  props.onChange(answers);
}

/**
* Function used in order to set the 'answers' array from a previos session
* @param {Array} answerSession The array of the answers.
*/
export function setAnswersArray(answerSession) {
  answers = answerSession;
}

/**
* Function used for displaying the elements from the right Column
* It builds a 'select' component with a list of options to store user answers
* @param {Object} props The object of the Right Element properties.
* @return {Object} rightElement  The MatchRightElement Component
*/
export function MatchRightElement(props) {
  leftElements = props.leftElements;
  rightElements = props.rightElements;

  return (
    <div className="matchRightElementWrapper">
      <div className="matchRightElement">
        <select
          className="form-control"
          id={props.index}
          disabled={props.inReview || props.inResult}
          onChange={e => onChange(e, props)}
          defaultValue={props.defaultAnswer.answer}
        >
          <option
            id={props.defaultValue.id}
            value={props.defaultValue.answer}
            key={props.defaultValue.id}
          >{props.defaultValue.answer}</option>
          {rightElements.map(obj =>
            <option
              id={obj.id}
              value={obj.answer}
              key={obj.id}
            > {obj.answer} </option>)}
        </select>

      </div>
    </div>
  );
}

MatchLeftElement.propTypes = {
  answer: React.PropTypes.string.isRequired,
};

MatchRightElement.propTypes = {
  index: PropTypes.number.isRequired,
  rightElements: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
  })).isRequired,
  leftElements: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
  })).isRequired,
  defaultValue: PropTypes.shape({
    id: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
  }).isRequired,
  defaultAnswer: PropTypes.shape({
    id: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
  }).isRequired,
  inReview: PropTypes.bool.isRequired,
  inResult: PropTypes.bool.isRequired,
};
