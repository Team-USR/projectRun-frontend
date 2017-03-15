import React from 'react';
import { BarChart, Bar, LineChart, XAxis, YAxis, Tooltip, Line } from 'recharts';
import QuizDot from './QuizDot';
import { CHART_COLOR } from '../../constants';


export function LineCh(props) {
  LineCh.propTypes = {
    data: React.PropTypes.arrayOf(React.PropTypes.shape({
      quiz: React.PropTypes.string,
      score: React.PropTypes.number,
    })).isRequired,
    color: React.PropTypes.string,
  };

  LineCh.defaultProps = {
    color: CHART_COLOR,
  };
  return props.data.length > 0 ? (
    <LineChart width={800} height={400} data={props.data}>
      <XAxis
        dataKey="name"
        padding={{ left: 30, right: 30 }}
        fontWeight={700} stroke={props.color}
      />
      <YAxis
        tickCount={12}
        dataKey="score"
        domain={[0, 100]} fontWeight={700}
        stroke={props.color}
      />
      <Tooltip />
      <Line dataKey="score" fillOpacity={0.8} dot={<QuizDot />} strokeWidth={3} />
    </LineChart>
  ) : <h2 style={{ color: props.color }}>You have no quizzes submited yet!</h2>;
}

export function BarCh(props) {
  BarCh.propTypes = {
    data: React.PropTypes.arrayOf(React.PropTypes.shape({
      quiz: React.PropTypes.string,
      score: React.PropTypes.number,
    })).isRequired,
  };

  return (
    <BarChart width={800} height={400} data={props.data}>
      <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
      <YAxis tickCount={7} dataKey="score" domain={[0, 100]} />
      <Tooltip />
      <Bar dataKey="score" fillOpacity={0.3} barSize={30} />
    </BarChart>
  );
}
