import React from 'react';
import { PieChart, Pie, LineChart, XAxis, YAxis, Tooltip, Line, Cell, Text } from 'recharts';
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
        dataKey="score"
        domain={[0, 100]} fontWeight={700}
        stroke={props.color}
      />
      <Tooltip />
      <Line type="monotone" dataKey="score" fillOpacity={0.8} dot={<QuizDot />} strokeWidth={3} />
    </LineChart>
  ) : <h3>{props.placeholder}</h3>;
}

function renderLabel(pie) {
  const radius = pie.innerRadius + ((pie.outerRadius - pie.innerRadius) * 0.3);
  const x = pie.cx + (radius * Math.cos(-pie.midAngle * (Math.PI / 180)));
  const y = pie.cy + (radius * Math.sin(-pie.midAngle * (Math.PI / 180)));
  return (
    <Text x={x} y={y} fill="#fff" fontSize="2.5em" dominantBaseline="central">
      {pie.value ? `${pie.name}: ${pie.value}` : ''}
    </Text>
  );
}

export function PieCh(props) {
  PieCh.propTypes = {
    data: React.PropTypes.arrayOf(React.PropTypes.shape({
      quiz: React.PropTypes.string,
      score: React.PropTypes.number,
    })).isRequired,
  };

  return (
    <PieChart width={800} height={400}>
      <Pie
        data={props.data}
        cx={400}
        cy={200}
        outerRadius={200}
        label={pie => renderLabel(pie)}
        fill="#8884d8"
      >
        {props.data.map((entry, index) => {
          if (entry && index) {
            return (
              <Cell key={`cell-${index + 1}`} fill="#228B22" style={{ textAllign: 'center' }}>
                <Text>{entry.name}</Text>
              </Cell>
            );
          }
          return <Cell key={`cell-${index + 1}`} fill="#A91101" />;
        })}
      </Pie>
    </PieChart>
  );
}
