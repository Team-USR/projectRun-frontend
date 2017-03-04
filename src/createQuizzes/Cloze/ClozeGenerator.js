import React from 'react';
import { ClozeForm } from './ClozeForm';
import { ClozeList } from './ClozeList';

export default class ClozeGenerator extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      questions: [],
    };

    this.addQuestion = this.addQuestion.bind(this);
  }

  addQuestion(s) {
    const question = {
      no: this.state.current,
      question: s,
    };
    this.state.current += 1;
    this.state.questions.push(question);
  }

  render() {
    return (
      <div>
        <ClozeForm addQuestion={this.addQuestion} />
        <ClozeList questions={this.state.questions} />
      </div>
    );
  }
}
