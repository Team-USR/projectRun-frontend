import React, { PropTypes } from 'react';

const answers = [];
let leftElements = [];
let rightElements = [];

/* Function used for displaying the elements from the left Column */
export default function MatchLeftElement(props) {
  return (
    <div className="matchLeftElementWrapper">
      <div className="matchLeftElement">
        <div className="leftText"> {props.answer} </div>
      </div>
    </div>
  );
}

/* This function is called when the user slect an option from dropdown
*  It updates the 'answer' array with the selected options
*/
function onChange(e) {
  const target = e.nativeEvent.target;

  // nth Option inside a Select tag
  const indexOfOption = target.selectedIndex;
  const selectedOptionID = target[indexOfOption].id;

  // nth Select tag
  const indexOfElement = target.id;
  const leftMatchID = leftElements[indexOfElement].id;

  answers[indexOfElement] =
    { leftID: leftMatchID, rightID: selectedOptionID };
}

/* Function used in order to get the 'answers' array */
export function getAnswers() {
  return answers;
}

/* Function used for displaying the elements from the right Column */
export function MatchRightElement(props) {
  leftElements = props.leftElements;
  rightElements = props.rightElements;

  return (
    <div className="matchRightElementWrapper">
      <div className="matchRightElement">
        <select id={props.index} disabled={props.inReview || props.inResult} onChange={onChange}>
          <option
            id={props.defaultValue.id}
            value={props.defaultValue.answer}
            key={props.defaultValue.id}
          >{props.defaultValue.answer}</option>
          {rightElements.map(obj =>
            <option id={obj.id} value={obj.answer} key={obj.id}> {obj.answer} </option>)}
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
  inReview: PropTypes.bool.isRequired,
  inResult: PropTypes.bool.isRequired,
};
