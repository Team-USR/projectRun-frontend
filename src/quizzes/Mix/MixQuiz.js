import React, { Component } from 'react';
import { WordButton } from './index';

export default class MixQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonsArray: [],
      topArray: [],
      bottomArray: [],
      receivedArray: [
        'Lets',
        'test',
        'this',
        'code',
        'xd'],
    };
  }
  componentWillMount() {
    const emptyArray = [];
    const wordArray = [];
    this.state.receivedArray.map((word, index) => {
      emptyArray.push(index);
      wordArray.push(<WordButton
        key={index} text={word} onClick={() =>
        this.handleClick(index)}
      />);
      return (' ');
    },
    );
    this.setState({
      buttonsArray: wordArray,
      bottomArray: emptyArray,
    });
    console.log(wordArray);
  }

  handleClick(index) {
    const bArray = this.state.bottomArray;
    const tArray = this.state.topArray;
    console.log(index);
    if (bArray[index] !== null) {
      tArray.push(index);
      bArray[index] = null;
      console.log(bArray);
    } else {
      const pos = tArray.indexOf(index);
      bArray[index] = index;
      tArray.splice(pos, 1);
    }
    this.setState({
      topArray: tArray,
      bottomArray: bArray,
    });
  }

  renderButtons(iArray) {
    return (
      iArray.map(
        index => this.state.buttonsArray[index],
      )
    );
  }

  render() {
    return (
      <div className="generatorContainer">
        <div className="solutionContainer" id="solutionContainer">
          Your solution so far: {this.renderButtons(this.state.topArray)}
        </div>
        <div className="wordsContainer" id="wordsContainer">
          {this.renderButtons(this.state.bottomArray)}
        </div>
      </div>
    );
  }
}
