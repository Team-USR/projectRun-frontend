import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';

export default class CreateClassPanel extends Component {

  constructor() {
    super();
    this.state = {
      newClassTitle: '',
    };
  }

  handleInputChange(e) {
    this.setState({ newClassTitle: e.target.value });
  }

  render() {
    return (
      <div>
        <h1><b> Create a new class</b></h1>
        <hr />
        <input
          type="text"
          onChange={e => this.handleInputChange(e)}
        />
        <Button
          onClick={() => this.props.handleSaveNewClassClick(this.state.newClassTitle)}
        > Create</Button>
      </div>
    );
  }
}

CreateClassPanel.propTypes = {
  handleSaveNewClassClick: PropTypes.func.isRequired,
};
