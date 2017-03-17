import React from 'react';
import { ClozeForm, ClozeList } from './index';


function findTokens(clozePhrase, currentInd) {
  const gaps = [];
  while (clozePhrase.length) {
    const gapText = {
      no: currentInd,
      gap_text: clozePhrase[0].split(/[{}]/)[1],
    };
    clozePhrase.splice(0, 1);
    if (clozePhrase.length && clozePhrase[0].match(/\*[A-zÀ-ÿ0-9]+\*/)) {
      gapText.hint_attributes = {
        hint_text: clozePhrase[0].split(/\*/g)[1],
      };
      clozePhrase.splice(0, 1);
    }
    gaps.push(gapText);
  }
  return gaps;
}


export default class ClozeGenerator extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      count: 1,
      questions: [],
      gaps_attributes: [],
      toSendQuestions: [],
    };

    this.addQuestion = this.addQuestion.bind(this);
    this.removeQuestion = this.removeQuestion.bind(this);
    this.isReviewMode = this.isReviewMode.bind(this);
    this.isResultsMode = this.isResultsMode.bind(this);
    this.strip = this.strip.bind(this);
  }

  strip(question) {
    const gapsArray = question.match(/{[A-zÀ-ÿ0-9]+}/g);
    const findIndex = match => `{${gapsArray.indexOf(match) + this.state.count}}`;

    return {
      phrase: question.replace(/{[A-zÀ-ÿ0-9]+}/g, findIndex).split(/\*[A-zÀ-ÿ0-9]+\*/g).join(''),
      length: gapsArray.length,
    };
  }

  isReviewMode() {
    this.setState({ reviewState: !this.state.reviewState });
  }

  isResultsMode() {
    this.setState({ resultsState: !this.state.resultsState });
  }

  addQuestion(text) {
    const question = {
      no: this.state.current,
      question: text,
    };
    const gapsAndHints = text.match(/{[A-zÀ-ÿ0-9]+}|\*[A-zÀ-ÿ0-9]+\*/g);
    const gaps = findTokens(gapsAndHints, this.state.current);
    const stripResult = this.strip(text);

    const newGapAttr = this.state.gaps_attributes.concat(gaps);
    const newQuestions = this.state.questions.concat(question);
    const newToSend = this.state.toSendQuestions.concat({
      no: this.state.current,
      question: stripResult.phrase,
    });

    this.setState({ current: this.state.current + 1,
      count: this.state.count + stripResult.length,
      gaps_attributes: newGapAttr,
      questions: newQuestions,
      toSendQuestions: newToSend,
    });
    this.props.updateParent(this.props.index,
      newToSend.map(q => q.question).join('\n'),
      newGapAttr.map((g) => {
        if (g.hint_attributes) {
          return {
            gap_text: g.gap_text,
            hint_attributes: {
              hint_text: g.hint_attributes.hint_text,
            },
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
