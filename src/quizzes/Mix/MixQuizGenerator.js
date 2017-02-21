import React, { Component } from 'react';
import { WordButton } from './WordButton';

export default class MixQuizGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wordsArray: [],
      currentArray: [],
      receivedArray: [
        'Lets',
        'test',
        'this',
        'code',
        'xd'],
    };
  }


  componentWillMount() {
    const buttonArray = [];
    for (let i = 0; i < this.state.receivedArray.length; i += 1) {
      buttonArray.push(<WordButton
        key={i} isInArray="false"
        text={this.state.receivedArray[i]} onClick={() => this.handleClick(buttonArray[i])}
      />);
    }
    this.setState({ wordsArray: buttonArray,
      currentArray: Array(this.state.receivedArray.length).fill(null) });

    //  console.log(buttonArray);
  }

  handleClick(button) {
    const wordsCopy = this.state.wordsArray;
    const currentCopy = this.state.currentArray;
    if (wordsCopy.indexOf(button) !== -1 && wordsCopy[wordsCopy.indexOf(button)] !== null) {
      //  console.log('button is in words at ' + wordsCopy.indexOf(button));
      currentCopy.splice(currentCopy.indexOf(null), 0, button);
      wordsCopy[wordsCopy.indexOf(button)] = null;
    } else if (currentCopy.indexOf(button) !== -1) {
      //  console.log('button is in words at ' + currentCopy.indexOf(button));
      wordsCopy.splice(wordsCopy.indexOf(null), 0, button);
      currentCopy[currentCopy.indexOf(button)] = null;
    }
    this.setState({
      wordsArray: wordsCopy,
      currentArray: currentCopy,
    });
  }

  render() {
    return (
      <div className="generatorContainer">
        <div className="solutionContainer" id="solutionContainer">
          Your solution so far: {this.state.currentArray}
        </div>
        <div className="wordsContainer" id="wordsContainer">
          {this.state.wordsArray}
        </div>
      </div>
    );
  }
}
