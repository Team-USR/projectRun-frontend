import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';

export default class MatchQuizItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      render: true,
      reviewState: false,
      resultState: false,
    };
    this.deleteCurrentItem = this.deleteCurrentItem.bind(this);
    this.updateReviewState = this.updateReviewState.bind(this);
  }

  deleteCurrentItem() {
    this.setState({ render: false });
    this.props.deleteMatchElement(this.props.id);
  }

  // TO DO: Disable the textareas when in review mode
  updateReviewState(isReview) {
    this.setState({ reviewState: isReview });
  }

  updateResutlState(isResult) {
    this.setState({ reviewState: isResult });
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
          disabled={this.props.reviewState}
          name={this.props.leftTextareaName}
          className="itemTexarea leftTextarea"
          placeholder={this.props.leftTextareaPlaceholder}
          rows="3" cols="25"
          onChange={e => this.props.onChange(e)}
        />
        <textarea
          id={this.props.id}
          disabled={this.props.reviewState}
          name={this.props.rightTextareaName}
          className="itemTexarea rightTextarea"
          placeholder={this.props.rightTextareaPlaceHolder}
          rows="3" cols="25"
          onChange={e => this.props.onChange(e)}
        />
        <div className="deleteMatchItemBtnContainer">
          <Button
            className="deleteMatchItemBtn"
            id={this.props.id}
            onClick={this.deleteCurrentItem}
          > X </Button>
        </div>
      </div>
    );

    if (this.state.render) {
      return item;
    }
    return null;
  }
}

MatchQuizItem.propTypes = {
  id: PropTypes.number.isRequired,
  leftTextareaName: PropTypes.string.isRequired,
  rightTextareaName: PropTypes.string.isRequired,
  reviewState: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  deleteMatchElement: PropTypes.func.isRequired,
  leftTextareaPlaceholder: PropTypes.string.isRequired,
  rightTextareaPlaceHolder: PropTypes.string.isRequired,
};
