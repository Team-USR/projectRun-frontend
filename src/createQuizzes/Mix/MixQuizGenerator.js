import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';
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

  static formatSolution(solution) {
    let wordsArray = this.splitSentence(solution);
    wordsArray = this.createWordsArray(wordsArray);
    let formatedSolution = '';
    wordsArray.map((element) => {
      if (formatedSolution === '') {
        formatedSolution = element;
      } else {
        formatedSolution = `${formatedSolution} ${element}`;
      }
      return '';
    });
    return formatedSolution;
  }

  static createWordsArray(finalDataArray) {
    const punctuations = ['...', '..', '.', ',', '!', '?', ':', ';'];
    const goodSolution = [];
    for (let i = 0; i < finalDataArray.length; i += 1) {
      goodSolution.push(finalDataArray[i]);
      for (let j = 0; j < punctuations.length; j += 1) {
        if (finalDataArray[i].indexOf(punctuations[j]) !== -1) {
          if (punctuations[j] === '...') {
            goodSolution.push('...');
            goodSolution[goodSolution.length - 2] =
            finalDataArray[i].slice(0, finalDataArray[i].length - 3);
            break;
          } else if (punctuations[j] === '..') {
            goodSolution.push('..');
            goodSolution[goodSolution.length - 2] =
            finalDataArray[i].slice(0, finalDataArray[i].length - 2);
            break;
          } else {
            goodSolution.push(finalDataArray[i][finalDataArray[i].length - 1]);
            goodSolution[goodSolution.length - 2] =
            finalDataArray[i].slice(0, finalDataArray[i].length - 1);
          }
        }
      }
    }
    return goodSolution;
  }

  constructor(props) {
    super(props);
    this.state = {
      words: [],
      mainSolution: '',
      alternateSolutions: [],
      errorMessage: '',
      mixQuizQuestion: '',
      formattedObject: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.addSolution = this.addSolution.bind(this);
  }

  componentWillMount() {
    const content = this.props.content;
    if (content !== null) {
      let mainSent = null;
      const altSent = [];
      const questionTitle = content.question;
      for (let i = 0; i < content.sentences.length; i += 1) {
        if (content.sentences[i].is_main) {
          mainSent = content.sentences[i].text;
        } else {
          altSent.push(content.sentences[i].text);
        }
      }
      this.setState({
        mainSolution: mainSent,
        alternateSolutions: altSent,
        mixQuizQuestion: questionTitle,
      });
      const formattedObj = this.updateFormattedObject(mainSent, altSent);
      this.props.updateParent(formattedObj,
        questionTitle, this.props.index);
    }
  }

  handleChange(event) {
    this.setState({ mainSolution: event.target.value });
    const formattedObj =
    this.updateFormattedObject(event.target.value, this.state.alternateSolutions);
    this.props.updateParent(formattedObj,
      this.state.mixQuizQuestion, this.props.index);
  }

  // submitData() {
  //   const xd = this.state.mainSolution;
  //   const finalDataArray = MixQuizGenerator.splitSentence(xd);
  //   const finalDataCopyLast = MixQuizGenerator.createWordsArray(finalDataArray);
  //   let finalDataCopy = [];
  //   finalDataCopyLast.map(element => finalDataCopy.push(element));
  //   finalDataCopy = finalDataCopy.sort().join(',');
  //   const alternateCopy = this.state.alternateSolutions;
  //   for (let i = 0; i < alternateCopy.length; i += 1) {
  //     const alternateSentArray =
  //     MixQuizGenerator.createWordsArray(MixQuizGenerator.splitSentence(alternateCopy[i]));
  //     if (finalDataCopy !== alternateSentArray.sort().join(',')) {
  //       const errorMess = `Alternate solution ${i + 1} cannot be made from the main one`;
  //       this.setState({ errorMessage: errorMess });
  //       return;
  //     }
  //   }
  // }

  updateFormattedObject(mainSol, alternateSols) {
    const sentenceAttributes = [];
    sentenceAttributes.push({
      text: MixQuizGenerator.formatSolution(mainSol),
      is_main: true,
    });
    alternateSols.map((element) => {
      if (element !== '') {
        sentenceAttributes.push({
          text: MixQuizGenerator.formatSolution(element),
          is_main: false,
        });
      }
      return ('');
    });
    this.setState({ formattedObject: sentenceAttributes });
    return sentenceAttributes;
  }

  addSolution() {
    const solCopy = this.state.alternateSolutions;
    solCopy.push('');
    this.setState({ alternateSolutions: solCopy });
    // console.log(this.state.alternateSolutions);
    const formattedObj =
    this.updateFormattedObject(this.state.mainSolution, solCopy);
    this.props.updateParent(formattedObj,
      this.state.mixQuizQuestion, this.props.index);
  }

  handleInputChange(e, index) {
    const solCopy = this.state.alternateSolutions;
    solCopy[index] = e.target.value;
    this.setState({ alternateSolutions: solCopy });
    // console.log(this.state.alternateSolutions);
    const formattedObj =
    this.updateFormattedObject(this.state.mainSolution, solCopy);
    //  console.log(formattedObj);
    this.props.updateParent(formattedObj,
      this.state.mixQuizQuestion, this.props.index);
  }

  removeSolution(index) {
    const solCopy = this.state.alternateSolutions;
    solCopy.splice(index, 1);
    this.setState({ alternateSolutions: solCopy });
    // console.log(this.state.alternateSolutions);
    const formattedObj =
    this.updateFormattedObject(this.state.mainSolution, solCopy);
    this.props.updateParent(formattedObj,
      this.state.mixQuizQuestion, this.props.index);
  }

  handleQuestionInputChange(e) {
    const target = e.target;
    const value = target.value;
    this.setState({ mixQuizQuestion: value });
    const formattedObj =
    this.updateFormattedObject(this.state.mainSolution, this.state.alternateSolutions);
    this.props.updateParent(formattedObj,
      value, this.props.index);
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
        <h3> Mix Question </h3>
        <b>Question: </b>
        <input
          type="text"
          name="matchQuizTitle"
          className="quizTitleInput"
          value={this.state.mixQuizQuestion}
          placeholder={'insert a title or question for this quiz'}
          onChange={e => this.handleQuestionInputChange(e)}
        />
        <div className="mixQuizGenerator">
          <div className="mixQuizInput">
            <input
              className="form_input"
              value={this.state.mainSolution}
              placeholder="Type your sentence"
              rows="10" cols="30" onChange={this.handleChange}
            />
            <Button type="button" onClick={this.addSolution}>Add another solution</Button>
          </div>
          {this.renderAlternateSolution()}
          <p style={style}>{this.state.errorMessage}</p>
        </div>
      </div>
    );
  }
}
MixQuizGenerator.propTypes = {
  index: PropTypes.number.isRequired,
  updateParent: PropTypes.func.isRequired,
  content: PropTypes.shape({}),
};

MixQuizGenerator.defaultProps = {
  content: null,
};
