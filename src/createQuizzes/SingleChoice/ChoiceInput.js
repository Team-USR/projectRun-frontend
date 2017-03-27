import React, { Component } from 'react';
import { Button, Col } from 'react-bootstrap';

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
      <div >
        <Col md={12}>
          <Col md={3} className="choiceInput">
      Choice {displayedIndex}:
        {this.props.text}
          </Col>
          <Col md={6}>
            <input
              className="form-control choiceText"
              id="choiceInput"type="text" defaultValue={answer} onChange={this.handleChange}
            />
          </Col>
          <Col md={3}>
          Answer: <input
            type="radio"
            name="group"
            onChange={this.handleAnswerChange} checked={this.props.ind === this.state.selected}
          />
            <Button onClick={this.onDelete} style={{ marginLeft: 5 }}>
              <span className="fa fa-times" /></Button>
          </Col>
        </Col>
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
