import React, { Component } from 'react';

class WordButton extends Component {
  render() {
    return (
      <button onClick={() => this.props.onClick()}>{this.props.text}</button>
    );
  }

}

export { WordButton };
