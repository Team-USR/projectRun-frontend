import React, { Component } from 'react';

class WordButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      partOfSolution: false,
    };
    this.moveButton = this.moveButton.bind(this);
  }
  moveButton(event) {
    const newPartOfSolution = !this.state.partOfSolution;
    console.log(newPartOfSolution);
    this.setState({ partOfSolution: newPartOfSolution });
    this.props.callbackParent(newPartOfSolution, this);
  }
  render() {
    return (
      <button onClick={this.moveButton}>{this.props.text}</button>
    );
  }

}

export { WordButton };
