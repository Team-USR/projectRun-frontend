import React from 'react';
import { ClozeForm, ClozeList } from './index';
import { GAP_MATCHER, HINT_MATCHER } from '../../constants';
import { getNOfGaps, buildRawSentence, findTokens, buildToSendQuestions } from '../../helpers/Cloze';

export default class ClozeGenerator extends React.Component {

  constructor(props) {
    super(props);
    if (!props.editorContent || Object.keys(props.editorContent).length === 0) {
      this.state = {
        current: 0,
        questions: [],
        gapsAttributes: [],
        toSendQuestions: [],
      };
    } else {
      const gapsCopy = props.editorContent.gaps.slice();
      const gapsAttributes = props.editorContent.gaps.map((gap, ind) => ({
        no: ind,
        gap_text: gap.gap_text,
        hint_attributes: {
          hint_text: gap.hint ? gap.hint.hint_text : '',
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
      const toSendQuestions = buildToSendQuestions(questions);

      this.state = {
        current: props.editorContent.cloze_sentence.text.split('\n').length,
        questions,
        gapsAttributes,
        toSendQuestions,
      };
    }


    this.addQuestion = this.addQuestion.bind(this);
    this.removeQuestion = this.removeQuestion.bind(this);
  }

  addQuestion(text) {
    const question = {
      no: this.state.current,
      question: text,
    };
    const gapsAndHintsMatcher = new RegExp(`${GAP_MATCHER.source}|${HINT_MATCHER.source}`, 'g');
    const gapsAndHints = text.match(gapsAndHintsMatcher);
    const gaps = findTokens(gapsAndHints, this.state.current);

    const newGapAttr = this.state.gapsAttributes.concat(gaps);
    const newQuestions = this.state.questions.concat(question);
    const newToSend = buildToSendQuestions(newQuestions);

    this.setState({ current: this.state.current + 1,
      gapsAttributes: newGapAttr,
      questions: newQuestions,
      toSendQuestions: newToSend,
    });

    this.props.updateParent(this.props.index,
      newToSend.map(q => q.question).join('\n'),
      newGapAttr.map(g => ({
        gap_text: g.gap_text,
        hint_attributes: {
          hint_text: g.hint_attributes.hint_text,
        },
      })),
    );
  }

  removeQuestion(delQ) {
    const newGapAttr = this.state.gapsAttributes.filter(g => g.no !== delQ.no);
    const newQuestions = this.state.questions.filter(q => q !== delQ);
    const newToSend = buildToSendQuestions(newQuestions);
    this.setState({
      questions: newQuestions,
      gapsAttributes: newGapAttr,
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
  editorContent: {},
};
