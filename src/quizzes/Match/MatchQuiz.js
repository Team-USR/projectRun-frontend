import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import MatchLeftElement, { MatchRightElement } from './MatchElement';
import '../../style/Match.css';

export default class MatchQuiz extends Component {

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
          { id: '000', text: 'Choose a value!' },
          { id: '101', text: 'Purple' },
          { id: '202', text: 'Green' },
          { id: '303', text: 'Red' },
          { id: '404', text: 'Yellow' },
          { id: '505', text: 'Orange' },
        ],
      },

      // TEST Input state object for Match Quiz
      matchQuizAnswers: [
        { '001': '202' },
        { '002': '101' },
        { '003': '505' },
        { '004': '303' },
        { '005': '404' },
      ],
    };
  }

  render() {
    const matchQuizQuestions = this.state.matchQuizQuestions;
    const leftElements = matchQuizQuestions.leftElements;
    return (
      <div className="matchQuizContainer">

        <div className="leftColumn">
          { MatchQuiz.shuffleArray(leftElements).map(obj =>
            <MatchLeftElement id={obj.id} text={obj.text} key={obj.id} />)}
        </div>

        <div className="rightColumn">
          { leftElements.map(obj =>
            <MatchRightElement rightElements={matchQuizQuestions.rightElements} key={obj.id} />) }

        </div>

        <div className="submitPanel">
          <Button className="submitButton">SUBMIT</Button>
        </div>
      </div>

    );
  }
}
