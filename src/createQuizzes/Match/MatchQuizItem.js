import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import '../../style/Match/CreateMatchQuiz.css';

export default class CreateMatchQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      render: true,
      reviewState: false,
      resultState: false,
    };
    this.deleteMatchEl = this.deleteMatchEl.bind(this);
    this.updateReviewState = this.updateReviewState.bind(this);
  }

  deleteMatchEl() {
    // console.log('delete');
    this.setState({ render: false });
    this.props.deleteMatchElement(this.props.id);
  }

  // TO DO: Disable the textareas when in review mode
  updateReviewState(isReview) {
    this.setState({ reviewState: isReview });
  }

  render() {
    const quizID = `quizItem + ${this.props.id}`;
    const item = (
      <div className="quizItem" id={quizID} key={0}>
        <div className="itemIndex">
          <label htmlFor="item">{ this.props.id + 1 }</label>
        </div>
        <textarea
          id={this.props.id}
          disabled={this.state.reviewState}
          name={this.props.leftTextareaName} className="itemTexarea leftTextarea"
          rows="3" cols="30"
          onChange={e => this.props.onChange(e)}
          defaultValue={this.props.defaultValue}
        />
        <textarea
          id={this.props.id}
          disabled={this.props.reviewState}
          name={this.props.rightTextareaName} className="itemTexarea rightTextarea"
          rows="3" cols="30"
          onChange={e => this.props.onChange(e)}
          defaultValue={this.props.defaultValue}
        />
        <div className="">
          <Button className="" id={this.props.id} onClick={this.deleteMatchEl}> X </Button>
        </div>
      </div>
    );

    if (this.state.render) {
      return item;
    }
    return null;
  }
}

CreateMatchQuiz.propTypes = {
  id: PropTypes.number.isRequired,
  leftTextareaName: PropTypes.string.isRequired,
  rightTextareaName: PropTypes.string.isRequired,
};
