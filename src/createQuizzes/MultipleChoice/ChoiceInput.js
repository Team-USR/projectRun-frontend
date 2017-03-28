import React, { Component } from 'react';
import { Button, Col } from 'react-bootstrap';

let answer;
let isCorrect;
/*
   Component that represents the choice input field
*/
export default class ChoiceInput extends Component {
  constructor() {
    super();
    this.state = { choice: '', answer: false };
    this.onDelete = this.onDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAnswerChange = this.handleAnswerChange.bind(this);
  }
  /*
  When first mounted it checks if there are any answers that needs to be
  completed( the case when this component is mounted from the editor)
  */
  componentWillMount() {
    if (this.props.answersToComplete !== undefined) {
      answer = this.props.answersToComplete.answer;
      isCorrect = this.props.answersToComplete.is_correct;
      if (isCorrect === undefined) isCorrect = false;
      this.setState({ choice: answer, answer: isCorrect });
    }
  }
  /*
    When the component was finally mounted the parent will be updated with the content of the input
  */
  componentDidMount() {
    this.props.callbackParentInput(this.props.ind, this.state.choice, this.state.answer);
  }
  /*
  Handle the change when a choice needs to be deleted and updates the parent.
  */
  onDelete() {
    this.setState({ choice: '' });
    this.props.callbackParent(this.props.ind);
  }
  /*
    Handles the change of the input and updates the parent.
    @param event
  */
  handleChange(event) {
    this.setState({ choice: event.target.value });
    this.props.callbackParentInput(this.props.ind, event.target.value, this.state.answer);
  }
  handleAnswerChange() {
    const correct = !this.state.answer;
    this.setState({ answer: correct });
    this.props.callbackParentInput(this.props.ind, this.state.choice, correct);
  }
  /*
  Main render function
  */
  render() {
    const { displayedIndex } = this.props;

    return (
      <div>
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
            type="checkbox"
            onChange={this.handleAnswerChange} checked={this.state.answer}
          />
            <Button onClick={this.onDelete} style={{ marginLeft: 5 }}>
              <span className="fa fa-times" />
            </Button>
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
};
ChoiceInput.defaultProps = {
  text: '',
  answersToComplete: {},
};
