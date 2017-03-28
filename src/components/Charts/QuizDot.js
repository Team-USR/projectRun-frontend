import React from 'react';

/**
 * Renders a circle that will be used in the line chart
 * @param {object} props inherited properties
 */
export default function QuizDot(props) {
  QuizDot.propTypes = {
    cy: React.PropTypes.number,
    cx: React.PropTypes.number,
  };

  QuizDot.defaultProps = {
    cy: 0,
    cx: 0,
  };
  /**
   * Returns green circle if passing mark, red otherwise
   * @type {Object}
   */
  const { cy, cx } = props;
  if (400 - cy < 160) {
    return <circle cx={cx} cy={cy} r={5} fill="#8D0000" />;
  }
  return <circle cx={cx} cy={cy} r={5} fill="#228B22" />;
}
