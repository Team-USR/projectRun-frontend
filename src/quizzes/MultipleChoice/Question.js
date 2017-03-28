import React, { PropTypes } from 'react';
/*
  Component that renders the question and the id of the multiple choice.
*/
export default function Question(props) {
  return (
    <h3>{props.index + 1}. {props.question}</h3>
  );
}
Question.propTypes = {
  index: PropTypes.number.isRequired,
  question: PropTypes.string.isRequired,
};
