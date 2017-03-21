import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

let answer;
let isCorrect;
export default class ChoiceInput extends Component {
  constructor() {
    super();
    this.state = { choice: '', answer: false, selected: null };
    this.onDelete = this.onDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAnswerChange = this.handleAnswerChange.bind(this);
  }
  componentWillMount() {
    if (this.props.answersToComplete !== undefined) {
      answer = this.props.answersToComplete.answer;
      isCorrect = this.props.answersToComplete.is_correct;
      if (isCorrect === undefined) isCorrect = false;
  //    console.log(isCorrect);
    //  console.log("answers",answer);
      this.setState({ choice: answer, answer: isCorrect, selected: this.props.selected });
    }
  }
  componentDidMount() {
    this.props.callbackParentInput(this.props.ind, this.state.choice, this.state.answer);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ selected: nextProps.selected });
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
    this.setState({ selected: this.props.ind });
    this.props.callbackParentInput(this.props.ind, this.state.choice, true);
  }

  render() {
    const { displayedIndex } = this.props;
  //  console.log(this.props.ind, this.state.selected);
    return (
      <div className="form-group small-margin-top">
        <div className="col-md-9">
          <div className="form-group">
            <div className="col-md-3">
              <label htmlFor="choiceInput" className="control-label">
              Choice: {displayedIndex}
                {this.props.text}
              </label>
            </div>
            <div className="col-md-9">
              <input
                id="choiceInput"type="text" defaultValue={answer} onChange={this.handleChange} className="form-control"
              />
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <label htmlFor="isCorrect">
            <input
            type="radio"
            name="group"
            onChange={this.handleAnswerChange} checked={this.props.ind === this.state.selected}
          /> Is Correct
          </label>
        </div>
        <div className="col-md-1">
          <Button onClick={this.onDelete}>X</Button>
        </div>
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
  answersToComplete: React.PropTypes.shape({
    answer: React.PropTypes.string,
    is_correct: React.PropTypes.bool,
  }),
  selected: React.PropTypes.number,
};
ChoiceInput.defaultProps = {
  text: '',
  answersToComplete: {},
  selected: null,
};
