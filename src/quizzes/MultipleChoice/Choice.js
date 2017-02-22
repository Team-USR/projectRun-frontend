import React, { Component } from 'react';

class Choice extends Component {
  constructor({ initialChecked }) {
    super();
    this.state = { checked: initialChecked };
  }
  onStateChanged() {
    const newState = !this.state.checked;
    const index = this.state.index;
    this.setState({ checked: newState });
    this.props.callbackParent(newState, this.props.id, index);
  }
  renderLabel(value, choiceText, inReview) {
    if (inReview) {
      return (
        <input
          type="checkbox"
          value={value}
          checked={this.state.checked}
          disabled
          onChange={() => this.onStateChanged()}
        />
      );
    }
    return (
      <input
        type="checkbox"
        value={value}
        checked={this.state.checked}
        onChange={() => this.onStateChanged()}
      />
    );
  }
  render() {
    const { value, choiceText, inReview } = this.props;
    return (
      <div>
        <label htmlFor="0">
          {this.renderLabel(value, choiceText, inReview)}
          {choiceText}
        </label>
        <br />
      </div>
    );
  }
}
Choice.propTypes = {
  callbackParent: React.PropTypes.func.isRequired,
  value: React.PropTypes.number.isRequired,
  choiceText: React.PropTypes.string.isRequired,
  inReview: React.PropTypes.bool.isRequired,
  id: React.PropTypes.number.isRequired,
};

export default Choice;
