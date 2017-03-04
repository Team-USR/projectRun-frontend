import React from 'react';
import { ClozeForm, ClozeList } from './index';

export default class ClozeGenerator extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      questions: [],
    };

    this.addQuestion = this.addQuestion.bind(this);
    this.removeQuestion = this.removeQuestion.bind(this);
  }

  addQuestion(s) {
    const question = {
      no: this.state.current,
      question: s,
    };
    this.setState({ current: this.state.current + 1 });
    this.setState({ questions: this.state.questions.concat(question) });
  }

  removeQuestion(delQ) {
    this.setState({ questions: this.state.questions.filter(q => q !== delQ) });
  }

  render() {
    return (
      <div>
        <ClozeForm addQuestion={this.addQuestion} />
        <ClozeList questions={this.state.questions} removeQuestion={this.removeQuestion} />
      </div>
    );
  }
}
