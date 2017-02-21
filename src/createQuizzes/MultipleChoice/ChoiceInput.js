import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

export default class ChoiceInput extends Component {
  constructor() {
    super();
    this.state = { choice: '', answer: false };
    this.onDelete = this.onDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  onDelete() {
    this.setState({ choice: '' });
    this.props.callbackParent(this.props.ind);
  }
  handleChange(event) {
    this.setState({ choice: event.target.value });
    this.props.callbackParentInput(this.props.ind, this.state.choice, this.state.answer);
  }
  render() {
    const { ind } = this.props;
    return (
      <div>
        <label htmlFor="choiceInput">
        Choice:{ind}
          {this.props.text}
          <input
            id="choiceInput"type="text" value={this.state.choice} onChange={this.handleChange}
          />
        </label>

          Answer: <input type="checkbox" />
        <Button onClick={this.onDelete}>Remove</Button>
      </div>
    );
  }
}
ChoiceInput.propTypes = {
  callbackParent: React.PropTypes.func.isRequired,
  callbackParentInput: React.PropTypes.func.isRequired,
  ind: React.PropTypes.number.isRequired,
//  text: React.PropTypes.string.isRequired,
};
