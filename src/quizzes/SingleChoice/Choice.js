import React, { Component, PropTypes } from 'react';

class Choice extends Component {
  constructor() {
    super();
    this.state = { checked: false, selected: null };
  }
  componentWillMount() {
    if (this.props.defaultValue !== null) {
      let sel = null;
      if (this.props.defaultValue === true) {
        sel = this.props.id;
      }
      this.setState({ checked: this.props.defaultValue, selected: sel });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultValue !== null) {
      let sel = null;
      if (nextProps.defaultValue === true) {
        sel = this.props.id;
      }
      this.setState({ checked: nextProps.defaultValue, selected: sel });
    }
  }
  onStateChanged() {
  //  console.log('changed',this.state.checked);
    const newState = !this.state.checked;
    const index = this.state.index;
    this.setState({ checked: newState });
    this.props.callbackParent(newState, this.props.id, index);
  }
  renderLabel(value, choiceText, inReview) {
    if (inReview) {
      return (
        <input
          type="radio"
          name="group"
          value={value}
          checked={this.state.checked}
          disabled
          onChange={() => this.onStateChanged()}
        />
      );
    }
//    console.log(this.state.checked);
    return (
      <input
        type="radio"
        name="group"
        value={value}
        checked={this.props.id === this.state.selected}
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
