import React, { PropTypes } from 'react';

export default function Question(props) {
  return (
    <h3>{props.index}. {props.question}</h3>
  );
}
Question.propTypes = {
  index: PropTypes.number.isRequired,
};
