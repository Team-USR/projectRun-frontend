import React, { Component } from 'react';
import { WordButton } from './WordButton';

class MixQuizGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wordsArray: [],
      currentArray: [],
      receivedArray: [
        { id: 0, word: 'Lets' },
        { id: 1, word: 'test' },
        { id: 2, word: 'this' },
        { id: 3, word: 'code' },
        { id: 4, word: 'xd' }],
    };
    this.state.wordsArray = this.createWordsArray(this.state.receivedArray);
    // this.populateArray(this.state.receivedArray);
    // this.moveToSolution = this.moveToSolution.bind(this);
    // this.moveToWords = this.moveToWords.bind(this);
  }
  createWordsArray(receivedArray) {
    return receivedArray.map((element) => {
      //  this.state.wordsArray.push(element);
      //  console.log(this.state.wordsArray);
      return (<WordButton
        key={element.id}
        id={element.id}
        callbackParent={(partOfSolution, buttonPressed) => {
          this.switchPlace(partOfSolution, buttonPressed);
        }} text={element.word}
      />);
    });
  }

  // componentDidMount() {
  //   const buttonsArray = document.getElementById('wordsContainer').children;
  //   for (let i = 0; i < buttonsArray.length; i += 1) {
  //     this.state.wordsArray.push(buttonsArray[i]);
  //   }
  //   console.log(this.state.wordsArray);
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

  switchPlace(partOfSolution,buttonPressed) {
    // if (this.state.wordsArray.indexOf(buttonPressed) !== -1) {
    //   console.log('buttonPressed');
    // }
    console.log(buttonPressed);
    console.log(this.state.wordsArray);
  }

  render() {
    return (
      <div className="generatorContainer">
        <div className="solutionContainer" id="solutionContainer">
          Your solution so far:
        </div>
        <div className="wordsContainer" id="wordsContainer">
          {this.state.wordsArray}
        </div>
      </div>
    );
  }
}

export { MixQuizGenerator };
