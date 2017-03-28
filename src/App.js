import React from 'react';
import { NavBarContainer } from './containers';
import './App.css';

/**
 * external css file import
 */
require('react-toggle/style.css');
require('react-input-calendar/style/index.css');

/**
 * Main container in which the whole app is rendered
 * @param {Object} props inherited properties
 */
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
