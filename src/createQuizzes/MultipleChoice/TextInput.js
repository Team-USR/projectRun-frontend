import React, { Component, PropTypes } from 'react';

/*
 Component that handles the text input of an answer
*/
export default class TextInput extends Component {
  /*
  Constructor for the TextInput
  @param props
  */
  constructor(props) {
    super(props);
    this.state = { value: '' };
    this.handleChange = this.handleChange.bind(this);
  }
  /*
  Handles the change of the text inside the input
  */
  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  /*
  Main render function.
  */
  render() {
    return (
      <label htmlFor="textInput">
        { this.props.text }
        <input id="textInput" type="text" onChange={this.handleChange} />
      </label>
    );
  }
}
TextInput.propTypes = {
  text: PropTypes.string.isRequired,

};
TextInput.defaultProps = {
  value: '',
  callbackParent: '',
};
