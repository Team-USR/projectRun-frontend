import React, { PropTypes, Component } from 'react';
import { Button, Col } from 'react-bootstrap';
import AlternateSolution from './AlternateSolution';

/**
 * Component that creates a Mix Quiz Generator
 * @type {Object}
 */
export default class MixQuizGenerator extends Component {
  /**
   * Method that splits a sentence into words by spaces
   * @param  {String} sentence string that contains either the main solution
   * or an alternative solution
   * @return {Array} the split array into words
   */
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
  /**
   * This method formats takes a String parameter and first it splits it into
   * words using splitSentence method, and then it uses createWordsArray
   * to format the words in the array in such a way that there are is no
   * punctuation at the end of a letter/letters. Finally, it creates a string
   * with the words in the array while filtering out the empty values.
   * @param  {String} solution string that contains either the main solution
   * or an alternative solution
   * @return {String} formatted sentence
   */
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
 /**
  * This method takes an array of words and removes any punctuation from the end
  * of a word, and adds it as a new word. This is done by checking if a punctuation
  * sign from an already defined array appears in a word, if it does, it is removed
  * from the current word and added as a new one in that array.
  * @param  {Array} finalDataArray array of words
  * @return {Array} formatted array as described above
  */
  static createWordsArray(finalDataArray) {
    const punctuations = ['...', '..', '.', ',', '!', '?', ':', ';'];
    const goodSolution = [];
    for (let i = 0; i < finalDataArray.length; i += 1) {
      goodSolution.push(finalDataArray[i]);
      for (let j = 0; j < punctuations.length; j += 1) {
        if (finalDataArray[i].indexOf(punctuations[j]) !== -1) {
          if (punctuations[j] === '...' && finalDataArray[i].length !== 3) {
            goodSolution.push('...');
            goodSolution[goodSolution.length - 2] =
            finalDataArray[i].slice(0, finalDataArray[i].length - 3);
            break;
          } else if (punctuations[j] === '..' && finalDataArray[i].length !== 2) {
            goodSolution.push('..');
            goodSolution[goodSolution.length - 2] =
            finalDataArray[i].slice(0, finalDataArray[i].length - 2);
            break;
          } else if (punctuations[j] === finalDataArray[i]) {
            break;
          } else if (finalDataArray[i].length !== punctuations[j].length) {
            goodSolution.push(finalDataArray[i][finalDataArray[i].length - 1]);
            goodSolution[goodSolution.length - 2] =
            finalDataArray[i].slice(0, finalDataArray[i].length - 1);
          }
        }
      }
    }
    return goodSolution;
  }
  /**
   * The mixQuizGenerator constructor that initializes the state and binds
   * certain buttons.
   * @param  {Object} props props
   */
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
  /**
   * Special React method that is called before the component
   * has mounted and it checks if it has received anything though props from its
   * parent. If it has, it updates component states, else it does nothing.
   */
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
  /**
   * Event handler for the main solution input field. It updates a state in the
   * component with the new value received from the event and calls a method
   * received from the parent in order to update the value there as well.
   * @param  {event} event event that contains the new value the user has typed in
   */
  handleChange(event) {
    this.setState({ mainSolution: event.target.value });
    const formattedObj =
    this.updateFormattedObject(event.target.value, this.state.alternateSolutions);
    this.props.updateParent(formattedObj,
      this.state.mixQuizQuestion, this.props.index);
  }
  /**
   * This method takes all the input provided and creates a well formatted object
   * to sent a post request with it.
   * @param  {String} mainSol       string from the main input field
   * @param  {Array} alternateSols array containing the alternative solutions
   * @return {object}               object with a special format to be used in
   * requests
   */
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
  /**
   * event handler that adds an empty position to the state alternateSolutions
   * array and also updates the parent copy
   */
  addSolution() {
    const solCopy = this.state.alternateSolutions;
    solCopy.push('');
    this.setState({ alternateSolutions: solCopy });
    const formattedObj =
    this.updateFormattedObject(this.state.mainSolution, solCopy);
    this.props.updateParent(formattedObj,
      this.state.mixQuizQuestion, this.props.index);
  }
  /**
   * Event handler that updates the alternateSolutions array with the new value
   * at the index position, while updating the parent copy using a prop method
   * @param  {event} e     event containing new value typed in
   * @param  {Number} index position in the array
   */
  handleInputChange(e, index) {
    const solCopy = this.state.alternateSolutions;
    solCopy[index] = e.target.value;
    this.setState({ alternateSolutions: solCopy });
    const formattedObj =
    this.updateFormattedObject(this.state.mainSolution, solCopy);
    this.props.updateParent(formattedObj,
      this.state.mixQuizQuestion, this.props.index);
  }
  /**
   * Event handler that removes an alternative solution at the index received as
   * a parameter
   * @param  {Number} index position to remove an alternative solution from
   */
  removeSolution(index) {
    const solCopy = this.state.alternateSolutions;
    solCopy.splice(index, 1);
    this.setState({ alternateSolutions: solCopy });
    const formattedObj =
    this.updateFormattedObject(this.state.mainSolution, solCopy);
    this.props.updateParent(formattedObj,
      this.state.mixQuizQuestion, this.props.index);
  }
  /**
   * Event handler that updates the question title in state and in the parent
   * @param  {Event} e the event containing the new value
   */
  handleQuestionInputChange(e) {
    const target = e.target;
    const value = target.value;
    this.setState({ mixQuizQuestion: value });
    const formattedObj =
    this.updateFormattedObject(this.state.mainSolution, this.state.alternateSolutions);
    this.props.updateParent(formattedObj,
      value, this.props.index);
  }
  /**
   * Rendering method used for the alternative solutions
   * @return {Array} array of tags containing the alternative solutions
   */
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
  /**
   * Component rendering method
   * @return {Object} Component body
   */
  render() {
    const style = { color: '#d10c0f' };
    return (
      <div className="mixQuizGeneratorContainer">
        <h3 className="question_title"> Mix Question </h3>
        <Col md={12} className="question_wrapper">
          <Col md={2} className="question_line">
            <h4 className="question_heading">Question: </h4>
          </Col>
          <Col md={10}>
            <input
              type="text"
              name="matchQuizTitle"
              className="form-control"
              value={this.state.mixQuizQuestion}
              placeholder={'ex: Mixed-up sentence exercise'}
              onChange={e => this.handleQuestionInputChange(e)}
            />
          </Col>
        </Col>
        <div className="mixQuizGenerator">
          <div className="mixQuizInput">
            <Col md={12} className="question_wrapper">
              <Col md={2} className="question_line">
                <h4 className="question_heading">Sentence: </h4>
              </Col>
              <Col md={10}>
                <input
                  className="form-control"
                  value={this.state.mainSolution}
                  placeholder="ex: This App is amazing!"
                  rows="10" cols="30" onChange={this.handleChange}
                />
              </Col>
            </Col>
            <Button
              className="add_solution"
              type="button"
              onClick={() => this.addSolution()}
            >
              Add an alternative solution
            </Button>
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
