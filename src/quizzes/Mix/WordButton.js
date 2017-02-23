import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

export default class WordButton extends Component {
  render() {
    if (this.props.reviewState || this.props.resultsState) {
      return (
        <Button
          onClick={() => this.props.onClick()}
          disabled
        >{this.props.text}</Button>
      );
    } else {
      return (
        <Button
          onClick={() => this.props.onClick()}
        >{this.props.text}</Button>
      );
    }
  }

}
