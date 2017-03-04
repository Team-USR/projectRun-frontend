import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

export default class ChoiceInput extends Component {
  constructor() {
    super();
    this.state = { choice: '', answer: false };
    this.onDelete = this.onDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAnswerChange = this.handleAnswerChange.bind(this);
  }
  onDelete() {
    this.setState({ choice: '' });
    this.props.callbackParent(this.props.ind);
  }
  handleChange(event) {
    this.setState({ choice: event.target.value });
    this.props.callbackParentInput(this.props.ind, event.target.value, this.state.answer);
  }
  handleAnswerChange() {
    const correct = !this.state.answer;
    this.setState({ answer: correct });
    this.props.callbackParentInput(this.props.ind, this.state.choice, correct);
  }
  render() {
    const { displayedIndex } = this.props;
    return (
      <div >
        <label htmlFor="choiceInput">
        Choice:{displayedIndex}
          {this.props.text}
          <input
            id="choiceInput"type="text" value={this.state.choice} onChange={this.handleChange}
          />
        </label>

          Answer: <input type="checkbox" onChange={this.handleAnswerChange} />
        <Button onClick={this.onDelete}>X</Button>
      </div>
    );
  }
}
ChoiceInput.propTypes = {
  callbackParent: React.PropTypes.func.isRequired,
  callbackParentInput: React.PropTypes.func.isRequired,
  displayedIndex: React.PropTypes.number.isRequired,
  ind: React.PropTypes.number.isRequired,
  text: React.PropTypes.string,
};
ChoiceInput.defaultProps = {
  text: '',
};
