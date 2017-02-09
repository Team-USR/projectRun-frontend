import React, { PropTypes } from 'react';

/* Function used for displaying the elements from the left Column */
export default function MatchLeftElement(props) {
  return (
    <div className="matchLeftElementWrapper">
      <div className="matchLeftElement">
        <div className="leftText"> {props.text} </div>
      </div>
    </div>
  );
}
/* Function used for displaying the elements from the right Column */
export function MatchRightElement(props) {
  return (
    <div className="matchRightElementWrapper">
      <div className="matchRightElement">

        <select>
          {props.rightElements.map(obj =>
            <option id={obj.id} value={obj.text} key={obj.id}> {obj.text} </option>)}
        </select>

      </div>
    </div>
  );
}

MatchLeftElement.propTypes = {
  text: React.PropTypes.string.isRequired,
};

MatchRightElement.propTypes = {
  rightElements: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  })).isRequired,
};
