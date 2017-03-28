import React, { Component, PropTypes } from 'react';
/*
  Component that represents a single choice
*/
class Choice extends Component {

  constructor() {
    super();
    this.state = { checked: false };
  }
  /*
    When mounting it decides if the checkbox has a default value or not in the case of the reviewer
  */
  componentWillMount() {
    if (this.props.defaultValue !== null && this.props.defaultValue !== undefined) {
      this.setState({ checked: this.props.defaultValue });
    }
    this.props.callbackParent(this.props.defaultValue);
  }
  /*
   Handles the change of the checbox and updates the parent component.
  */
  onStateChanged() {
    const newState = !this.state.checked;
    this.setState({ checked: newState });
    this.props.callbackParent(newState);
  }
  /*
    Renders the checkbox on the screen depening on the state (reviewState or not)
    ex: reviewState: checkbox disabled
  */
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
  /*
    Main render method
  */
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
