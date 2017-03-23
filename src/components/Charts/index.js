import React from 'react';
import { PieChart, Pie, LineChart, XAxis, YAxis, Tooltip, Line, Cell, Text, Legend } from 'recharts';
import QuizDot from './QuizDot';
import { CHART_COLOR } from '../../constants';


export function LineCh(props) {
  LineCh.propTypes = {
    data: React.PropTypes.arrayOf(React.PropTypes.shape({
      name: React.PropTypes.string,
      score: React.PropTypes.number,
    })).isRequired,
    color: React.PropTypes.string,
    placeholder: React.PropTypes.string,
  };

  LineCh.defaultProps = {
    color: CHART_COLOR,
    placeholder: 'You have no quizzes submited yet.',
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
        dataKey="value"
        domain={[0, 100]} fontWeight={700}
        stroke={props.color}
      />
      <Tooltip />
      <Line type="monotone" dataKey="value" fillOpacity={0.8} dot={<QuizDot />} strokeWidth={3} />
    </LineChart>
  ) : <h3>{props.placeholder}</h3>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const RADIAN = Math.PI / 180;

function renderLabel(pie) {
  const radius = pie.innerRadius + ((pie.outerRadius - pie.innerRadius) * 0.5);
  const x = pie.cx + (radius * Math.cos(-pie.midAngle * RADIAN));
  const y = pie.cy + (radius * Math.sin(-pie.midAngle * RADIAN));

  return (
    <Text x={x} y={y} fill="#fff" textAnchor={x > pie.cx ? 'start' : 'end'} fontSize="2.5em" dominantBaseline="central">
      {`${(pie.percent * 100).toFixed(0)}%`}
    </Text>
  );
}

export function PieCh(props) {
  return (
    <PieChart width={900} height={450}>
      <Pie
        data={props.data}
        cx={400}
        cy={200}
        label={pie => renderLabel(pie)}
        outerRadius={200}
        fill="#8884d8"
      >
        {props.data.map((entry, index) =>
          (<Cell key={entry.name} fill={COLORS[index % COLORS.length]}>
            <Text stroke="#000">{entry.name}</Text>
          </Cell>))}
      </Pie>
      <Legend verticalAlign="bottom" align="center" />
    </PieChart>
  );
}

PieCh.propTypes = {
  data: React.PropTypes.arrayOf(React.PropTypes.shape({
    quiz: React.PropTypes.string,
    score: React.PropTypes.number,
  })).isRequired,
};
