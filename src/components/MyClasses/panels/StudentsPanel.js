import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

export default class StudentsPanel extends Component {
  constructor() {
    super();
    this.state = { value: '' };
    this.changeInput = this.changeInput.bind(this);
  }

  changeInput(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    return (
      <div className="studentsPanelContainer">
        <form>
          <input value={this.state.value} onChange={this.changeInput} />
          <input style={{ marginLeft: '500px' }} ref={(c) => { this.file = c; }} type="file" onClick={this.importCSV} />
          <Button onClick={this.parseFile}>Ghici ciuperca</Button>
        </form>
      </div>
    );
  }
}
