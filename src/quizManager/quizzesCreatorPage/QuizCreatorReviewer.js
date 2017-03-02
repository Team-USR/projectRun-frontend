import React, { Component } from 'react';
import axios from 'axios';
import { MultipleChoiceQuiz } from '../../quizzes/MultipleChoice';
import { MatchQuiz } from '../../quizzes/Match/';
import { MixQuiz } from '../../quizzes/Mix/';

const styles = {
  quizTitle: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
  },
  loading: {
    textAlign: 'center',
    marginTop: 100,
  },
};
export default class QuizCreatorReviewer extends Component {
  constructor() {
    super();
    this.state = { loadingQuiz: true,
      quizInfo: [],
      reviewState: true,
      resultsState: false,
      answers: { questions: [] },
      getResponse: '',
      data: {},
    };
    this.isReviewMode = this.isReviewMode.bind(this);
  }
  componentWillMount() {
    const auth = 'Authorization';
    axios.defaults.headers.common[auth] = this.props.token;
    console.log(this.props.quizID);
    axios.get(`https://project-run.herokuapp.com/quizzes/${this.props.quizID}`)
    .then(response => this.setState({ quizInfo: response.data, loadingQuiz: false }));
  }
  isReviewMode() {
    const newState = !this.state.reviewState;
    this.setState({ reviewState: newState });
  }
  renderQuestions(question, index) {
    const answers = this.props.questionsWithAnswers;
    console.log(answers);
    const type = answers[index].type;
     console.log(type);
    let answersAttributes = [];
    if (question.type === 'multiple_choice') {
      if (type === 'multiple_choice') {
        answersAttributes = answers[index].answers_attributes;
        // console.log(answersAttributes);
      }
      return (
        <MultipleChoiceQuiz
          id={question.id}
          reviewState={this.state.reviewState}
          resultsState={this.state.resultsState}
          question={question}
          index={index}
          correctAnswer={{}}
          creatorAnswers={answersAttributes}
          callbackParent={() => {}}
          key={`multiple_choice_quiz_${question.id}`}
        />
      );
    }
    if (question.type === 'match') {
      return (
        <MatchQuiz
          id={question.id}
          reviewState={this.state.reviewState}
          resultsState={this.state.resultsState}
          question={question}
          index={index}
          correctAnswer={this.state.data[question.id]}
          callbackParent={() => {}}
          key={`match_quiz_${question.id}`}
        />
      );
    }
    if (question.type === 'mix') {
      return (
        <MixQuiz
          question={question}
          index={index}
          key={question.id}
          reviewState={this.state.reviewState}
          resultsState={this.state.resultsState}
        />
      );
    }
    return ('');
  }
  render() {
    if (this.state.loadingQuiz) {
      return (<div className="mainQuizViewerBlock" style={styles.loading}>
        <h1>Loading quiz draft...</h1>
      </div>);
    }
    return (
      <div className="mainQuizViewerBlock">
        <h1 style={styles.quizTitle}>{this.state.quizInfo.title}</h1>
        {this.state.quizInfo.questions.map((question, index) =>
        this.renderQuestions(question, index))}
      </div>
    );
  }
}

QuizCreatorReviewer.propTypes = {
  quizID: React.PropTypes.number.isRequired,
  token: React.PropTypes.string.isRequired,
  questionsWithAnswers: React.PropTypes.arrayOf(React.PropTypes.shape({})).isRequired,
};
