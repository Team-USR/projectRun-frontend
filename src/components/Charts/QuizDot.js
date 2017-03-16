import React from 'react';

export default function QuizDot(props) {
  QuizDot.propTypes = {
    cy: React.PropTypes.number,
    cx: React.PropTypes.number,
  };

  QuizDot.defaultProps = {
    cy: 0,
    cx: 0,
  };

  const { cy, cx } = props;
  if (400 - cy < 160) {
    return <circle cx={cx} cy={cy} r={5} fill="#8D0000" />;
  }
  return <circle cx={cx} cy={cy} r={5} fill="#228B22" />;
}
