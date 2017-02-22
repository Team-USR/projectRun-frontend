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
      wordArray.push(<WordButton key={index + 1} text={word} onClick={() =>
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
  // createWordsArray(receivedArray) {
  //   return receivedArray.map((element) => {
  //     //  this.state.wordsArray.push(element);
  //     //  console.log(this.state.wordsArray);
  //     return (<WordButton
  //       key={element.id}
  //       id={element.id}
  //       onClick={(partOfSolution, buttonPressed) => {
  //         this.switchPlace(partOfSolution, buttonPressed);
  //       }} text={element.word}
  //     />);
  //   });
  // }

  // componentDidMount() {
  //   const buttonsArray = document.getElementById('wordsContainer').children;
  //   for (let i = 0; i < buttonsArray.length; i += 1) {
  //     this.state.wordsArray.push(buttonsArray[i]);
  //   }
  // }

  // populateArray(recArray) {
  //   return (recArray);
  // }
  //
  // moveToSolution(event) {
  //   console.log(event.target.id);
  //   const elToMove = document.getElementById(event.target.id);
  //   elToMove.onclick = this.moveToWords;
  //   //  const elToAppend = elToRemove;
  //   document.getElementById('solutionContainer').appendChild(elToMove);
  //   //  elToRemove.remove();
  //   this.setState(this.state);
  // }
  //
  // moveToWords(event) {
  //   console.log('changed to words');
  //   const elToMove = document.getElementById(event.target.id);
  //   elToMove.onClick = this.moveToSolution;
  //   document.getElementById('wordsContainer').appendChild(elToMove);
  //   this.setState(this.state);
  // }

  // switchPlace(partOfSolution,buttonPressed) {
  //   console.log(buttonPressed);
  //   console.log(this.state.wordsArray);
  // }

  // componentWillMount() {
  //   const buttonArray = [];
  //   for (let i = 0; i < this.state.receivedArray.length; i += 1) {
  //     buttonArray.push(<WordButton
  //       key={i} isInArray="false"
  //       text={this.state.receivedArray[i]} onClick={() => this.handleClick(buttonArray[i])}
  //     />);
  //   }
  //   this.setState({ wordsArray: buttonArray,
  //     currentArray: Array(this.state.receivedArray.length).fill(null) });
  //
  //   //  console.log(buttonArray);
  // }
  //
  // handleClick(button) {
  //   const wordsCopy = this.state.wordsArray;
  //   const currentCopy = this.state.currentArray;
  //   if (wordsCopy.indexOf(button) !== -1 && wordsCopy[wordsCopy.indexOf(button)] !== null) {
  //     //  console.log('button is in words at ' + wordsCopy.indexOf(button));
  //     currentCopy.splice(currentCopy.indexOf(null), 0, button);
  //     wordsCopy[wordsCopy.indexOf(button)] = null;
  //   } else if (currentCopy.indexOf(button) !== -1) {
  //     //  console.log('button is in words at ' + currentCopy.indexOf(button));
  //     wordsCopy.splice(wordsCopy.indexOf(null), 0, button);
  //     currentCopy[currentCopy.indexOf(button)] = null;
  //   }
  //   this.setState({
  //     wordsArray: wordsCopy,
  //     currentArray: currentCopy,
  //   });
  // }

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
