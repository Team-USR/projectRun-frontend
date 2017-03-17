import React from 'react';
import { ClozeSentence } from './index';

export default class ClozeQuestion extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      reviewState: true,
      resultsState: false,
    };
  }

  render() {
    return (
      <div className="clozeQuizContainer">
        <div className="questionPanel">
          <h3>{this.props.index}. {this.props.req}</h3>
        </div>
        <ol>
          {this.props.questions.map(q =>
            <ClozeSentence key={q.no} index={q.no} question={q.question} gaps={q.gaps} />)
          }
        </ol>
      </div>
    );
  }
}

ClozeQuestion.propTypes = {
  index: React.PropTypes.number.isRequired,
  req: React.PropTypes.string.isRequired,
  questions: React.PropTypes.arrayOf(React.PropTypes.shape({
    no: React.PropTypes.number,
    question: React.PropTypes.string,
    gaps: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.number,
      gap_text: React.PropTypes.string,
      hint: React.PropTypes.shape({
        id: React.PropTypes.number,
        hint_text: React.PropTypes.string,
      }),
    })),
  })).isRequired,
};
