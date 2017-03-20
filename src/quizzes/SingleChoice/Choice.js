import React, { Component, PropTypes } from 'react';

class Choice extends Component {
  constructor() {
    super();
    this.state = { checked: false, selected: null, index: null, id: null };
  }
  componentWillMount() {
    if (this.props.defaultValue !== null) {
      this.setState({
        checked: this.props.defaultValue,
        index: this.props.value,
        id: this.props.id });
    }
    this.setState({ selected: this.props.selected });
    if (this.props.selected === null) {
      if (this.props.defaultValue === true) {
        this.setState({ selected: this.props.value, checked: this.props.defaultValue });
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultValue !== null) {
      this.setState({ checked: nextProps.defaultValue, index: nextProps.value, id: nextProps.id });
    }
    if (nextProps.selected === nextProps.value) {
      this.setState({ checked: true });
    } else this.setState({ checked: false });
    this.setState({ selected: nextProps.selected });
    if (nextProps.selected === null) {
      if (nextProps.defaultValue === true) {
        this.setState({ selected: nextProps.value, checked: nextProps.defaultValue });
      }
    }
  }
  onStateChanged() {
    this.setState({ selected: this.state.index });
    this.props.callbackParent(true, this.state.id, this.state.index);
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
        checked={this.props.value === this.state.selected}
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
  selected: PropTypes.number,
};
Choice.defaultProps = {
  defaultValue: null,
  selected: null,
};

export default Choice;
