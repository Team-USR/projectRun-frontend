import React from 'react';
import { NavBarContainer } from './containers';
import './App.css';


require('react-toggle/style.css');
require('react-input-calendar/style/index.css');

export default function App(props) {
  return (
    <div className="appWrapper">
      <NavBarContainer />
      <div className="appContent">
        {props.children}
      </div>
    </div>
  );
}

App.propTypes = {
  children: React.PropTypes.element.isRequired,
};
