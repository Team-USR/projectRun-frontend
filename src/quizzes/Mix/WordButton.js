import React, { Component } from 'react';

export default class WordButton extends Component {
  render() {
    return (
      <button onClick={() => this.props.onClick()}>{this.props.text}</button>
    );
  }

}
