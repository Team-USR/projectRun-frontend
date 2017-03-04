import React from 'react';
import { NavBarContainer } from './containers';
import './App.css';

export default function App(props) {
  return (
    <div className="appWrapper">
      <NavBarContainer />
      {props.children}
    </div>
  );
}

App.propTypes = {
  children: React.PropTypes.element.isRequired,
};
