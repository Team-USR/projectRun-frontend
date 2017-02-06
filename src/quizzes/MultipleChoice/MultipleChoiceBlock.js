import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { QuestionWrapper } from './index';
import '../../style/MultipleChoice.css';

class MultipleChoiceBlock extends Component {


  render() {
    return (
      <div className="questionsBlock">
          <QuestionWrapper />
          <QuestionWrapper />
          <QuestionWrapper />
          <div className="submitPanel">
            <Button>SUBMIT</Button>
          </div>
      </div>
    );
  }
}

export { MultipleChoiceBlock };
