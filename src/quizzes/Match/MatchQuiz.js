import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import MatchLeftElement, { MatchRightElement, getAnswers } from './MatchElement';
import '../../style/Match.css';

class MatchQuiz extends Component {

  /** TODO: Move it somewhere else
 * Shuffles array in place. ES6 version
 * @param {Array} toBeShuffled  The array containing the items.
 * @return {Array} shuffledArray  The array with shuffled elements.
 */
  static shuffleArray(toBeShuffled) {
    const shuffledArray = toBeShuffled;
    for (let i = toBeShuffled.length; i; i -= 1) {
      const j = Math.floor(Math.random() * i);
      [shuffledArray[i - 1], shuffledArray[j]] = [toBeShuffled[j], toBeShuffled[i - 1]];
    }

    return shuffledArray;
  }

  constructor() {
    super();

    // TEST Input state object for Match Quiz
    this.state = {
      reviewState: false,
      resultState: false,
      matchQuizQuestions:
      {
        leftElements: [
          { id: '001', text: 'Apple' },
          { id: '002', text: 'Plum' },
          { id: '003', text: 'Peach' },
          { id: '004', text: 'Cherry' },
          { id: '005', text: 'Lemon' },
        ],
        rightElements: [
          { id: '101', text: 'Purple' },
          { id: '202', text: 'Green' },
          { id: '303', text: 'Red' },
          { id: '404', text: 'Yellow' },
          { id: '505', text: 'Orange' },
        ],
        defaultValue: { id: '000', text: 'Choose a value!' },
      },
      matchQuizAnswers: {
        '001': '202',
        '002': '101',
        '003': '505',
        '004': '303',
        '005': '404',
      },
    };

    const matchQuizQuestions = this.state.matchQuizQuestions;
    const leftElements = matchQuizQuestions.leftElements;
    const rightElements = matchQuizQuestions.rightElements;

    this.leftColumnShuffled = MatchQuiz.shuffleArray(leftElements);
    this.rightColumnShuffled = MatchQuiz.shuffleArray(rightElements);

    this.isReviewMode = this.isReviewMode.bind(this);
    this.isResultMode = this.isResultMode.bind(this);
  }

  checkAnswers(answers) {
    let correct = 0;
    for (let i = 0; i < answers.length; i += 1) {
      if (answers[i] && this.state.matchQuizAnswers[answers[i].leftID]) {
        if (this.state.matchQuizAnswers[answers[i].leftID] === answers[i].rightID) {
          correct += 1;
        }
      }
    }
    correct /= this.leftColumnShuffled.length;
    const percentage = correct * 100;
    return percentage;
  }

  isReviewMode() {
    const newState = !this.state.reviewState;
    this.setState({ reviewState: newState });
  }

  isResultMode() {
    const newState = !this.state.resultState;
    this.setState({ resultState: newState });

    const answers = getAnswers();
    this.score = this.checkAnswers(answers);
  }

  renderSubmitPanel() {
    const reviewState = this.state.reviewState;
    const resultState = this.state.resultState;

    if (reviewState && !resultState) {
      return (
        <div className="submitPanel">
          <Button className="submitButton" onClick={this.isReviewMode}>BACK</Button>
          <Button className="submitButton" onClick={this.isResultMode}>SUBMIT</Button>
        </div>
      );
    }
    if (!reviewState && !resultState) {
      return (
        <div className="submitPanel">
          <Button className="submitButton" onClick={this.isReviewMode}> FINISH</Button>
        </div>
      );
    }

    return (
      <div className="submitPanel">
        <h3>Well Done!</h3>
        <h3>Score: { this.score } % </h3>
      </div>
    );
  }

  renderLeftElement(obj) {
    this.obj = obj;
    const leftElement = (
      <MatchLeftElement
        id={obj.id}
        text={obj.text}
        key={obj.id}
      />
    );
    return leftElement;
  }

  renderRightElement(obj, index) {
    this.obj = obj;
    const rightElement = (
      <MatchRightElement
        rightElements={this.rightColumnShuffled}
        leftElements={this.leftColumnShuffled}
        defaultValue={this.state.matchQuizQuestions.defaultValue}
        inReview={this.state.reviewState}
        index={index}
        key={obj.id}
      />
    );
    return rightElement;
  }

  render() {
    const leftElements = this.leftColumnShuffled;
    const rightElements = this.rightColumnShuffled;

    const matchQuiz = (
      <div className="matchQuizContainer">

        { /* Display Left Column */ }
        <div className="leftColumn">
          { leftElements.map(obj => this.renderLeftElement(obj)) }
        </div>

        { /* Display Right Column */ }
        <div className="rightColumn">
          { rightElements.map((obj, index) =>
              this.renderRightElement(obj, index))
          }
        </div>

        { /* Display Buttons section */ }
        { this.renderSubmitPanel() }
      </div>

    );

    return matchQuiz;
  }
}

export default MatchQuiz;
