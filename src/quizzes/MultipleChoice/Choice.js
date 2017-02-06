import React, { Component } from 'react';

class Choice extends Component {
  constructor({ initialChecked }) {
   super();
   this.state = { checked: initialChecked }
   
 }
  onStateChanged() {
    const newState = !this.state.checked;
    this.setState({ checked: newState });
    this.props.callbackParent(newState);
  }
  render() {
    const { value, choiceText } = this.props;
      return (
          <div>
          <label htmlFor="0">
          <input type="checkbox" value={value} checked={this.state.checked} onChange={() => this.onStateChanged()} />
          {choiceText}
          </label>
          <br />
          </div>

     );
  }
}

export { Choice };
