import React from 'react';
import { BarChart, Bar, LineChart, XAxis, YAxis, Tooltip, Line } from 'recharts';
import { NavBarContainer } from './containers';
import './App.css';

export default function App(props) {
  const data = [{
    name: 'Quiz1',
    score: 90,
  }, {
    name: 'Quiz2',
    score: 95,
  }, {
    name: 'Quiz3',
    score: 30,
  }, {
    name: 'Quiz4',
    score: 100,
  }, {
    name: 'Quiz5',
    score: 55,
  }];
  return (
    <div className="appWrapper">
      <NavBarContainer />
      <div className="appContent">
        {props.children}
        <LineChart width={800} height={400} data={data}>
          <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
          <YAxis tickCount="7" dataKey="score" domain={[0, 100]} />
          <Tooltip />
          <Line dataKey="score" fillOpacity={0.8} />
        </LineChart>
        <BarChart width={800} height={400} data={data}>
          <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
          <YAxis tickCount="7" dataKey="score" domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="score" fillOpacity={0.3} barSize={30} />
        </BarChart>
      </div>
    </div>
  );
}

App.propTypes = {
  children: React.PropTypes.element.isRequired,
};
