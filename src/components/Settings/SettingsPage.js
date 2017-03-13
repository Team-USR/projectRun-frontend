import React, { Component } from 'react';

export default class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  renderSettings() {
    this.setiings = [];
    return (
      <div>
        <h1><b>Panel</b></h1>
      </div>
    );
  }

  render() {
    return (
      <div className="myClassesPageWrapper">
        <h1><b>Settings</b></h1>
        <div className="contentWrapper">
          { this.renderSettings() }
        </div>
      </div>
    );
  }
}
