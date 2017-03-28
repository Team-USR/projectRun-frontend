import React from 'react';
import { PieChart, Pie, LineChart, XAxis, YAxis, Tooltip, Line, Cell, Text, Legend } from 'recharts';
import QuizDot from './QuizDot';
import { CHART_COLOR } from '../../constants';

/**
 * The tooltip used for submitted quizes chart
 * @param {object} props inherited from the library component
 */
function CustomTooltip(props) {
  CustomTooltip.propTypes = {
    active: React.PropTypes.bool,
    payload: React.PropTypes.arrayOf(React.PropTypes.shape({
      payload: React.PropTypes.shape({
        date: React.PropTypes.string,
        name: React.PropTypes.string,
        value: React.PropTypes.number,
      }),
      value: React.PropTypes.number,
    })),
  };

  CustomTooltip.defaultProps = {
    payload: [],
    active: false,
  };
  /**
   * Renders the tooltip if the user hovers the line chart
   * @param  {Object} props inherited properties
   * @return {Object}       the JSX component
   */
  if (props.active) {
    return (
      <div className="tooltip-container">
        <h4><b>{props.payload[0].payload.name}</b></h4>
        <p>Score: {props.payload[0].payload.value}</p>
        <p>{props.payload[0].payload.date}</p>
      </div>
    );
  }
  return null;
}

/**
 * A line chart Recharts LineChart component
 * @param {Object} props inherited properties
 */
export function LineCh(props) {
  LineCh.propTypes = {
    data: React.PropTypes.arrayOf(React.PropTypes.shape({
      name: React.PropTypes.string,
      value: React.PropTypes.number,
      date: React.PropTypes.string,
    })).isRequired,
    color: React.PropTypes.string,
    placeholder: React.PropTypes.string,
  };

  LineCh.defaultProps = {
    color: CHART_COLOR,
    placeholder: '',
  };
  /**
   * Render chart if data is available or return text placeholder
   * @type {Object}
   */
  return props.data.length > 0 ? (
    <LineChart width={window.innerWidth - 350} height={450} data={props.data}>
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
      {props.data[0].date ? <Tooltip content={<CustomTooltip />} />
        : <Tooltip />}

      <Line type="monotone" dataKey="value" fillOpacity={0.8} dot={<QuizDot />} strokeWidth={3} />
    </LineChart>
  ) : <h3>{props.placeholder}</h3>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const RADIAN = Math.PI / 180;

/**
 * Positions percentages inside the pie chart
 * @param  {Object} pie default props
 * @return {Object}     JSX text element
 */
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

/**
 * A pie chart extending Recharts PieChart component
 * @param {Object} props inherited properties
 */
export function PieCh(props) {
  /**
   * Renders pie chart if data is available
   * @param  {Object} PieChart Recharts component
   * @return {Object}          custom pie chart
   */
  return (
    <PieChart width={700} height={450}>
      <Pie
        data={props.data}
        cx={350}
        cy={225}
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
