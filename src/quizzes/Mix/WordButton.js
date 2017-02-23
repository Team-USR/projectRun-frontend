import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';

export default function WordButton(props) {
  if (props.reviewState || props.resultsState) {
    return (
      <Button
        onClick={() => props.onClick()}
        disabled
      >{props.text}</Button>
    );
  }
  return (
    <Button
      onClick={() => props.onClick()}
    >{props.text}</Button>
  );
}
WordButton.propTypes = {
  reviewState: PropTypes.bool.isRequired,
  resultsState: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
