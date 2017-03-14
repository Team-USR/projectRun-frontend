import React, { Component } from 'react';

export default class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: 'teacher',
    };
  }

  onChange(e) {
    const name = e.target.name;
    if (name === 'teacher') {
      this.setState({ selectedOption: 'teacher' });
    } else if (name === 'student') {
      this.setState({ selectedOption: 'student' });
    }
  }

  renderSettings() {
    this.setiings = [];
    return (
      <div>
        <h1><b>Panel</b></h1>
        <form action="" >
          <input
            type="radio"
            name="teacher"
            value="teacher"
            onChange={e => this.onChange(e)}
            checked={this.state.selectedOption === 'teacher'}
          /> TEACHER<br />
          <input
            type="radio"
            name="student"
            value="student"
            onChange={e => this.onChange(e)}
            checked={this.state.selectedOption === 'student'}
          /> STUDENT<br />
        </form>
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
