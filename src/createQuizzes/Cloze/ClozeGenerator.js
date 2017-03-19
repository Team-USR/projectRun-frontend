import React from 'react';
import { ClozeForm, ClozeList } from './index';
import { GAP_MATCHER, HINT_MATCHER } from '../../constants';
import { getNOfGaps, buildRawSentence } from '../../helpers/Cloze';


function findTokens(clozePhrase, currentInd) {
  const gaps = [];
  while (clozePhrase.length) {
    const gapText = {
      no: currentInd,
      gap_text: clozePhrase[0].split(/[{}]/)[1],
    };
    clozePhrase.splice(0, 1);
    if (clozePhrase.length && clozePhrase[0].match(HINT_MATCHER)) {
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
    if (!props.editorContent) {
      this.state = {
        current: 0,
        count: 1,
        questions: [],
        gapsAttributes: [],
        toSendQuestions: [],
      };
    } else {
      const gapsCopy = props.editorContent.gaps.slice().reverse();
      const toSendQuestions = props.editorContent.cloze_sentence.text
        .split('\n').map((sentence, ind) => ({
          no: ind,
          question: sentence,
        }));
      const gapsAttributes = gapsCopy.map((gap, ind) => ({
        no: ind,
        gap_text: gap.gap_text,
        hint_attributes: {
          hint_text: gap.hint.hint_text,
        },
      }));
      const questions = props.editorContent.cloze_sentence.text
        .split('\n').map((sent, ind) => {
          const noGaps = getNOfGaps(sent);
          return ({
            no: ind,
            question: buildRawSentence(sent, gapsCopy.splice(0, noGaps)),
          });
        });

      this.state = {
        current: props.editorContent.cloze_sentence.text.split('\n').length,
        count: props.editorContent.gaps.length + 1,
        questions,
        gapsAttributes,
        toSendQuestions,
      };
    }


    this.addQuestion = this.addQuestion.bind(this);
    this.removeQuestion = this.removeQuestion.bind(this);
    this.strip = this.strip.bind(this);
  }

  strip(question) {
    const globalGMat = new RegExp(GAP_MATCHER.source, 'g');
    const gapsArray = question.match(globalGMat);
    const findIndex = match => `{${gapsArray.indexOf(match) + this.state.count}}`;

    return {
      phrase: question.replace(globalGMat, findIndex).split(HINT_MATCHER).join(''),
      length: gapsArray.length,
    };
  }

  addQuestion(text) {
    const question = {
      no: this.state.current,
      question: text,
    };
    const gapsAndHintsMatcher = new RegExp(`${GAP_MATCHER.source}|${HINT_MATCHER.source}`, 'g');
    const gapsAndHints = text.match(gapsAndHintsMatcher);
    const gaps = findTokens(gapsAndHints, this.state.current);
    const stripResult = this.strip(text);

    const newGapAttr = this.state.gapsAttributes.concat(gaps);
    const newQuestions = this.state.questions.concat(question);
    const newToSend = this.state.toSendQuestions.concat({
      no: this.state.current,
      question: stripResult.phrase,
    });

    this.setState({ current: this.state.current + 1,
      count: this.state.count + stripResult.length,
      gapsAttributes: newGapAttr,
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
      gapsAttributes: this.state.gapsAttributes.filter(g => g.no !== delQ.no),
      toSendQuestions: this.state.toSendQuestions.filter(q => q.no !== delQ.no),
    });
  }

  render() {
    return (
      <div>
        <h3>Fill in the gaps:</h3>
        <ClozeForm addQuestion={this.addQuestion} />
        <ClozeList questions={this.state.questions} removeQuestion={this.removeQuestion} />
      </div>
    );
  }
}

ClozeGenerator.propTypes = {
  updateParent: React.PropTypes.func.isRequired,
  index: React.PropTypes.number.isRequired,
  editorContent: React.PropTypes.shape({
    id: React.PropTypes.number,
    cloze_sentence: React.PropTypes.shape({
      text: React.PropTypes.string,
      id: React.PropTypes.number,
    }),
    gaps: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.number,
      gap_text: React.PropTypes.string,
      hint: React.PropTypes.shape({
        id: React.PropTypes.number,
        hint_text: React.PropTypes.string,
      }),
    })),
    points: React.PropTypes.number,
    question: React.PropTypes.string,
    type: React.PropTypes.string,
  }),
};

ClozeGenerator.defaultProps = {
  editorContent: [],
};
