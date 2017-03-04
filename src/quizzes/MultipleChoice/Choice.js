import React, { Component, PropTypes } from 'react';

class Choice extends Component {
  constructor() {
    super();
    this.state = { checked: false };
  }
  onStateChanged() {
    const newState = !this.state.checked;
    const index = this.state.index;
    this.setState({ checked: newState });
    this.props.callbackParent(newState, this.props.id, index);
  }
  renderLabel(value, choiceText, inReview) {
    let checkedValue = this.props.defaultValue;
  //  console.log(checkedValue);
    if (checkedValue === null) checkedValue = this.state.checked;
    if (inReview) {
      return (
        <input
          type="checkbox"
          value={value}
          checked={checkedValue}
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
  callbackParent: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
  choiceText: PropTypes.string.isRequired,
  inReview: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  defaultValue: PropTypes.bool,
};
Choice.defaultProps = {
  defaultValue: null,
};

export default Choice;
