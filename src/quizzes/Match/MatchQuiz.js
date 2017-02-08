import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { MatchLeftElement } from './index';

class MatchQuiz extends Component {
  constructor() {
    super();
    // Test input state
    this.state = {};
  }

  render() {
    return (
      <div className="questionsBlock">
        <div className="submitPanel">
          <Button className="submitButton">SUBMIT</Button>
        </div>
        <MatchLeftElement />
      </div>
    );
  }
}

export { MatchQuiz };
