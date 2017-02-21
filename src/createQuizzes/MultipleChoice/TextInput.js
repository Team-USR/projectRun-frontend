import React, { Component, PropTypes } from 'react';

export default class TextInput extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({ value: event.target.value });
    this.props.callbackParent(event.target.value);
  }
  render() {
    return (
      <label htmlFor="textInput">
        { this.props.text }
        <input id="textInput" type="text" value={this.props.value} onChange={this.handleChange} />
      </label>
    );
  }
}
TextInput.propTypes = {
  //callbackParent: PropTypes.func.isRequired,
//  value: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};
