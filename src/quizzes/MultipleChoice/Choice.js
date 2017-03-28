import React, { Component, PropTypes } from 'react';

class Choice extends Component {

  constructor() {
    super();
    this.state = { checked: false };
  }
  componentWillMount() {
    if (this.props.defaultValue !== null && this.props.defaultValue !== undefined) {
    //  console.log("wtf",this.props.defaultValue);
      this.setState({ checked: this.props.defaultValue });
    }
    this.props.callbackParent(this.props.defaultValue);
  }
  onStateChanged() {
  //  console.log('changed',this.state.checked);
    const newState = !this.state.checked;
    this.setState({ checked: newState });
    this.props.callbackParent(newState);
  }
  renderLabel(value, choiceText, inReview) {
    if (inReview) {
      return (
        <input
          className="inputChoice"
          type="checkbox"
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
        className="inputChoice"
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
      <div className="singleMultipleChoice">
        <label htmlFor={this.props.id}>
          {this.renderLabel(value, choiceText, inReview)}
          <span className="choiceName">
            {choiceText}
          </span>
        </label>
        <br />
      </div>
    );
  }
}
Choice.propTypes = {
  id: PropTypes.number.isRequired,
  callbackParent: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
  choiceText: PropTypes.string.isRequired,
  inReview: PropTypes.bool.isRequired,
  defaultValue: PropTypes.bool,
};
Choice.defaultProps = {
  defaultValue: null,
};

export default Choice;
