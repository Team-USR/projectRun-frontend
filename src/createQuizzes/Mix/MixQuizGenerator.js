import React, { Component } from 'react';
import AlternateSolution from './AlternateSolution';

export default class MixQuizGenerator extends Component {

  static splitSentence(sentence) {
    const dataArray = sentence.split(' ');
    const finalDataArray = dataArray.map(element => element.trim());
    for (let i = finalDataArray.length - 1; i >= 0; i -= 1) {
      if (finalDataArray[i] === '') {
        finalDataArray.splice(i, 1);
      }
    }
    return finalDataArray;
  }

  static createWordsArray(finalDataArray) {
    const punctuations = ['...', '..', '.', ',', '!', '?', ':', ';'];
    const finalDataCopy = [];
    finalDataArray.map(element => finalDataCopy.push(element));
    for (let i = 0; i < finalDataArray.length; i += 1) {
      for (let j = 0; j < punctuations.length; j += 1) {
        if (finalDataArray[i].indexOf(punctuations[j]) !== -1) {
          if (punctuations[j] === '...') {
            finalDataCopy.push('...');
            finalDataCopy[i] = finalDataArray[i].slice(0, finalDataArray[i].length - 3);
            break;
          } else if (punctuations[j] === '..') {
            finalDataCopy.push('..');
            finalDataCopy[i] = finalDataArray[i].slice(0, finalDataArray[i].length - 2);
            break;
          } else {
            finalDataCopy.push(finalDataArray[i][finalDataArray[i].length - 1]);
            finalDataCopy[i] = finalDataArray[i].slice(0, finalDataArray[i].length - 1);
          }
        }
      }
    }
    // console.log(finalDataCopy);
    return finalDataCopy;
  }

  constructor(props) {
    super(props);
    this.state = {
      words: [],
      mainSolution: '',
      alternateSolutions: [],
      errorMessage: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitData = this.submitData.bind(this);
    this.addSolution = this.addSolution.bind(this);
  }

  handleChange(event) {
    this.setState({ mainSolution: event.target.value });
  }

  submitData() {
    this.setState({ errorMessage: '' });
    const xd = this.state.mainSolution;
    const finalDataArray = MixQuizGenerator.splitSentence(xd);
    let finalDataCopy = MixQuizGenerator.createWordsArray(finalDataArray);
    finalDataCopy = finalDataCopy.sort().join(',');
    const alternateCopy = this.state.alternateSolutions;
    for (let i = 0; i < alternateCopy.length; i += 1) {
      const alternateSentArray =
      MixQuizGenerator.createWordsArray(MixQuizGenerator.splitSentence(alternateCopy[i]));
      if (finalDataCopy !== alternateSentArray.sort().join(',')) {
        const errorMess = `Alternate solution ${i + 1} cannot be made from the main one`;
        this.setState({ errorMessage: errorMess });
        return;
      }
    }
    const sentenceAttributes = [];
    sentenceAttributes.push({
      text: this.state.mainSolution,
      is_main: true,
    });
    this.state.alternateSolutions.map((element) => {
      if (element !== '') {
        sentenceAttributes.push({
          text: element,
          is_main: false,
        });
      }
      return ('');
    });
    // const x = { sentence_attributes: sentenceAttributes };
    // console.log(finalDataArray);
    // console.log(finalDataArray);
    // console.log(finalDataCopy);
    // console.log(x);
  }

  addSolution() {
    const solCopy = this.state.alternateSolutions;
    solCopy.push('');
    this.setState({ alternateSolutions: solCopy });
    // console.log(this.state.alternateSolutions);
  }

  handleInputChange(e, index) {
    const solCopy = this.state.alternateSolutions;
    solCopy[index] = e.target.value;
    this.setState({ alternateSolutions: solCopy });
    // console.log(this.state.alternateSolutions);
  }

  removeSolution(index) {
    const solCopy = this.state.alternateSolutions;
    solCopy.splice(index, 1);
    this.setState({ alternateSolutions: solCopy });
    // console.log(this.state.alternateSolutions);
  }

  renderAlternateSolution() {
    const renderedComponents = [];
    this.state.alternateSolutions.map((value, index) => {
      const ind = index;
      renderedComponents.push(
        <AlternateSolution
          key={`alternate_solution_${ind}`}
          index={index}
          handleInputChange={(e, i) => this.handleInputChange(e, i)}
          value={value}
          removeSolution={i => this.removeSolution(i)}
        />,
      );
      return ('');
    },
    );
    return renderedComponents;
  }

  render() {
    const style = { color: 'red' };
    return (
      <div className="mixQuizGeneratorContainer">
        <h1> MixQuiz title</h1>
        <div className="mixQuizGenerator">
          <div className="mixQuizInput">
            { this.props.text }
            <input
              value={this.state.mainSolution}
              rows="10" cols="30" onChange={this.handleChange}
            />
            <button type="button" onClick={this.addSolution}>Add another solution</button>
          </div>
          {this.renderAlternateSolution()}
          <button type="button" onClick={this.submitData}>Create Quiz</button>
          <p style={style}>{this.state.errorMessage}</p>
        </div>
      </div>
    );
  }
}
MixQuizGenerator.propTypes = {
  text: React.PropTypes.string.isRequired,
};
