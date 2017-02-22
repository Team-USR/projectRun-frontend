import React, { Component } from 'react';
import { WordButton } from './index';

export default class MixQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonsArray: [],
      topArray: [],
      bottomArray: [],
    };
  }
  componentWillMount() {
    const emptyArray = [];
    const wordArray = [];
    this.props.question.words.map((word, index) => {
      emptyArray.push(index);
      wordArray.push(<WordButton
        key={index} text={word} reviewstate={this.props.reviewState}
        resultsState={this.state.resultsState} onClick={() =>
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

  handleDisabling() {
    console.log("called");
    const wordArray = [];
    this.props.question.words.map((word, index) => {
      wordArray[index] = (<WordButton
        key={index} text={word} reviewstate={this.props.reviewState}
        resultsState={this.state.resultsState} onClick={() =>
        this.handleClick(index)}
      />);
      return (' ');
    });
    this.setState({
      buttonsArray: wordArray,
    });
  }
  handleClick(index) {
    const bArray = this.state.bottomArray;
    const tArray = this.state.topArray;
    console.log(bArray);
    console.log(tArray);
    if (bArray[index] !== null) {
      tArray.push(index);
      bArray[index] = null;
    } else {
      const pos = tArray.indexOf(index);
      bArray[index] = index;
      tArray.splice(pos, 1);
    }
    this.setState({
      topArray: tArray,
      bottomArray: bArray,
    });
    console.log(bArray);
    console.log(tArray);
  }

  renderButtons(iArray) {
    const returnedArray = [];
    // return iArray.map(index => <WordButton
    //   key={index} text={this.props.question.words[index]}
    //   reviewstate={this.props.reviewState}
    //   resultsState={this.state.resultsState} onClick={() =>
    //   this.handleClick(index)}
    // />);
    for (let i = 0; i < iArray.length; i += 1) {
      if (iArray[i] !== null) {
        returnedArray.push(<WordButton
          key={iArray[i]} text={this.props.question.words[iArray[i]]}
          reviewState={this.props.reviewState}
          resultsState={this.state.resultsState} onClick={() =>
          this.handleClick(iArray[i])}
        />);
      }
    }
    return returnedArray;
    // return (
    //   iArray.map(
    //     index => this.state.buttonsArray[index],
    //   )
    // );
  }


  render() {
    return (
      <div className="generatorContainer">
        <h3>{this.props.index}. {this.props.question.question}</h3>
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
