import React from 'react';
import { ClozeForm, ClozeList } from './index';

let c = 0;

function strip(question) {
  const increment = () => {
    c += 1;
    return `{${c}}`;
  };
  return question.replace(/{[A-zÀ-ÿ0-9]+}/g, increment).split(/\*[A-zÀ-ÿ0-9]+\*/g).join('');
}

export default class ClozeGenerator extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      questions: [],
      gaps_attributes: [],
      toSendQuestions: [],
    };

    this.addQuestion = this.addQuestion.bind(this);
    this.removeQuestion = this.removeQuestion.bind(this);
    this.isReviewMode = this.isReviewMode.bind(this);
    this.isResultsMode = this.isResultsMode.bind(this);
  }

  isReviewMode() {
    this.setState({ reviewState: !this.state.reviewState });
  }

  isResultsMode() {
    this.setState({ resultsState: !this.state.resultsState });
  }

  addQuestion(s) {
    const question = {
      no: this.state.current,
      question: s,
    };
    const gapsAndHints = s.match(/{[A-zÀ-ÿ0-9]+}|\*[A-zÀ-ÿ0-9]+\*/g);
    const gaps = [];
    while (gapsAndHints.length) {
      const gapText = {
        no: this.state.current,
        gap_text: gapsAndHints[0].split(/[{}]/)[1],
      };
      gapsAndHints.splice(0, 1);
      if (gapsAndHints.length && gapsAndHints[0].match(/\*[A-zÀ-ÿ]+\*/)) {
        gapText.hint_attributes = {
          hint_text: gapsAndHints[0].split(/\*/g)[1],
        };
        gapsAndHints.splice(0, 1);
      }
      gaps.push(gapText);
    }
    const newGapAttr = this.state.gaps_attributes.concat(gaps);
    const newQuestions = this.state.questions.concat(question);
    const newToSend = this.state.toSendQuestions.concat({
      no: this.state.current,
      question: strip(s),
    });
    this.setState({ current: this.state.current + 1,
      gaps_attributes: newGapAttr,
      questions: newQuestions,
      toSendQuestions: newToSend,
    });
    this.props.updateParent(this.props.index,
      newToSend.map((q) => {
        const newQ = {
          question: q.question,
        };
        return newQ;
      }),
      newGapAttr.map((g) => {
        if (g.hint_attributes) {
          return {
            gap_text: g.gap_text,
            hint_text: g.hint_text,
          };
        }
        return { gap_text: g.gap_text };
      }));
  }

  removeQuestion(delQ) {
    this.setState({ questions: this.state.questions.filter(q => q !== delQ),
      gaps_attributes: this.state.gaps_attributes.filter(g => g.no !== delQ.no),
      toSendQuestions: this.state.toSendQuestions.filter(q => q.no !== delQ.no),
    });
  }

  render() {
    return (
      <div>
        <h3>Fill in the gaps</h3>
        <ClozeForm addQuestion={this.addQuestion} />
        <ClozeList questions={this.state.questions} removeQuestion={this.removeQuestion} />
      </div>
    );
  }
}

ClozeGenerator.propTypes = {
  updateParent: React.PropTypes.func.isRequired,
  index: React.PropTypes.number.isRequired,
};
