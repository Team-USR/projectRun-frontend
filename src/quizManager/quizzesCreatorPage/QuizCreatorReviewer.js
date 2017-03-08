import React, { Component } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { MultipleChoiceQuiz } from '../../quizzes/MultipleChoice';
import { MatchQuiz } from '../../quizzes/Match/';
import { MixQuiz } from '../../quizzes/Mix/';
import { API_URL } from '../../constants';


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
      errorState: false,
    };
    this.isReviewMode = this.isReviewMode.bind(this);
  }
  componentWillMount() {
    axios({
      url: `${API_URL}/quizzes/${this.props.quizID}`,
      headers: this.props.userToken,
    })
    .then((response) => {
      if (!response || (response && response.status !== 200)) {
        this.setState({ errorState: true });
      }
      this.setState({ quizInfo: response.data, loadingQuiz: false });
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ loadingQuiz: true });
//    console.log("SDADS", nextProps.quizID);
    axios({
      url: `${API_URL}/quizzes/${nextProps.quizID}`,
      headers: this.props.userToken,
    })
    .then((response) => {
  //    console.log(response);
      if (!response || (response && response.status !== 200)) {
        this.setState({ errorState: true });
      }
      this.setState({ quizInfo: response.data, loadingQuiz: false });
    });
  }
  isReviewMode() {
    const newState = !this.state.reviewState;
    this.setState({ reviewState: newState });
  }
  renderQuestions(question, index) {
  //  console.log(answers);
  //  console.log(type);
    const answersAttributes = question.answers;
    if (question.type === 'multiple_choice') {
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
  //    console.log("RENDER QUIZ "+ this.props.quizID, this.state.quizInfo.title);
    if (this.state.errorState === true) {
      return (<div className="mainQuizViewerBlock" style={styles.loading}>
        <h1>Connection error...</h1>
      </div>);
    } else
    if (this.state.loadingQuiz) {
      return (<div className="mainQuizViewerBlock" style={styles.loading}>
        <h1>Loading draft...</h1>
      </div>);
    }
    return (
      <div className="mainQuizViewerBlock">
        <h1 style={styles.quizTitle}>{this.state.quizInfo.title}</h1>
        {this.state.quizInfo.questions.map((question, index) =>
        this.renderQuestions(question, index))}
        <div className="submitPanel">
          <Button
            className="submitButton"
            onClick={() => this.props.handleSubmitButton()}
          >EDIT QUIZ</Button>
        </div>
      </div>
    );
  }
}

QuizCreatorReviewer.propTypes = {
  userToken: React.PropTypes.shape({}).isRequired,
  handleSubmitButton: React.PropTypes.func.isRequired,
  quizID: React.PropTypes.string.isRequired,

};
