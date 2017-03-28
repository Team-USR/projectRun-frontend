import React, { Component } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { MultipleChoiceQuiz } from '../../quizzes/MultipleChoice';
import { SingleChoiceQuiz } from '../../quizzes/SingleChoice';
import { MatchQuiz } from '../../quizzes/Match/';
import { ClozeQuestion } from '../../quizzes/Cloze';
import { MixQuiz } from '../../quizzes/Mix/';
import { CrossQuiz } from '../../quizzes/Cross/';
import { API_URL } from '../../constants';
import { BrandSpinner } from '../../components/utils';
import { getNOfGaps } from '../../helpers/Cloze';

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
/*
 This component is the main wrapper for all types of quizzes.
 It renders them according to the API request and displays them to
 the students in order to solve them.
 */
export default class QuizViewerMainPage extends Component {
  constructor() {
    super();
    this.state = { loadingQuiz: true,
      quizInfo: [],
      reviewState: false,
      resultsState: false,
      answers: { questions: [] },
      getResponse: '',
      data: {},
      session: {},
      savedSession: true,
      score: null,
      error: false,
      totalScore: null,
    };
    this.isReviewMode = this.isReviewMode.bind(this);
    this.isResultsMode = this.isResultsMode.bind(this);
    this.saveSession = this.saveSession.bind(this);
  }
  /*
   Makes http request and retrieves a certain quiz which id is received from props
  */
  componentWillMount() {
    axios({
      url: `${API_URL}/quizzes/${this.props.quizID}`,
      headers: this.props.userToken,
    })
    .then(response => setTimeout(() => {
      this.setState({
        loadingQuiz: false,
        quizInfo: response.data.quiz,
        session: response.data.quiz_session,
      });
      this.loadSession();
    }, 510))
    .catch(() => {
      this.setState({ error: true });
      this.props.handleError('default');
    });
  }
  /*
    In case the component receives new props from it's parent it will make a new
    request and render the new quizz on the screen.
    @param nextProps
  */
  componentWillReceiveProps(nextProps) {
    if (this.props.quizID !== nextProps.quizID) {
      this.setState({ loadingQuiz: true });
      axios({
        url: `${API_URL}/quizzes/${nextProps.quizID}`,
        headers: this.props.userToken,
      })
      .then(response => setTimeout(() => {
        this.setState({
          loadingQuiz: false,
          quizInfo: response.data.quiz,
          session: response.data.quiz_session,
        });
        this.loadSession();
      }, 510));
    }
  }
  /*
   Sets a review state for the quiz in which the user is only able to see quiz
   and then prepare for submit.
  */
  isReviewMode() {
    const newState = !this.state.reviewState;
    this.setState({ reviewState: newState });
  }
  /*
  In case the quiz already has a saved session stored in the backend,
  this method loads it in to the local object that is prepared for the new submit.
  */
  loadSession() {
    const quest = [];
    this.state.quizInfo.questions.map((element, index) => {
      let ans;
      if (this.state.session.metadata && this.state.session.metadata[element.id]) {
        if (element.type === 'multiple_choice') {
          ans = this.state.session.metadata[element.id].answer_ids;
          const id = element.id;
          quest[index] = { answer_ids: ans, id };
        }
        if (element.type === 'single_choice') {
          ans = this.state.session.metadata[element.id].answer_id;
          const id = element.id;
          quest[index] = { answer_id: ans, id };
        }
        if (element.type === 'mix') {
          ans = this.state.session.metadata[element.id].answer;
          const id = element.id;
          quest[index] = { answer: ans, id };
        }
        if (element.type === 'cloze') {
          ans = this.state.session.metadata[element.id].answer_gaps;
          const id = element.id;
          quest[index] = { answer_gaps: ans, id };
        }
        if (element.type === 'match') {
          ans = this.state.session.metadata[element.id].pairs;
          const id = element.id;
          quest[index] = { pairs: ans, id };
        }
        if (element.type === 'cross') {
          ans = this.state.session.metadata[element.id].rows;
          const id = element.id;
          quest[index] = { rows: ans, id };
        }
      }
      return (null);
    });

    const q = { questions: quest };
    this.setState({ answers: q });
  }
  /*
    Method that saves the current session by making a post request containing
    the current solution
  */
  saveSession() {
    this.setState({ savedSession: true });
    axios({
      url: `${API_URL}/quizzes/${this.props.quizID}/save`,
      headers: this.props.userToken,
      method: 'post',
      data: this.state.answers,
    })
    .then(() => setTimeout(() => {
      this.setState({
        loadingQuiz: false,
      });
      this.props.reloadSideBar();
    }, 510));
  }
  isResultsMode() {
    axios({
      url: `${API_URL}/quizzes/${this.state.quizInfo.id}/submit`,
      data: this.state.answers,
      headers: this.props.userToken,
      method: 'post',
    })
    .then((response) => {
      const newState = !this.state.resultsState;
      const dataSet = response.data.feedback;
      const newData = {};
      dataSet.map((object) => {
        newData[object.id] = object;
        return 0;
      });
      this.setState({
        resultsState: newState,
        getResponse: response,
        data: newData,
        score: response.data.points,
        totalScore: response.data.total_points });
      this.props.reloadSideBar();
    });
  }
  /*
    Method that is collecting the input from it's child components.
    @param id {Number}
    @param answers {array} [array of answers that needs to be collected]
    @param type {String} [type of the question that is being collected]
    @param index {Number} [index of the question being collected from]
  */
  collectAnswers(id, answers, type, index) {
    this.setState({ savedSession: false });
    const tempAnswers = this.state.answers;
    const tempQuestions = this.state.answers.questions;
    let newAnswer = {};
    let allFalse = false;
    if (type === 'multiple_choice') {
      const mcqAnswer = { id, answer_ids: answers };
      newAnswer = mcqAnswer;
      if (answers.length === 0) {
        allFalse = true;
        tempQuestions.splice(index, 1);
      }
    }
    if (type === 'single_choice') {
      const mcqAnswer = { id, answer_id: answers };
      newAnswer = mcqAnswer;
    }
    if (type === 'match') {
      const matchAnswer = { id, pairs: answers };
      newAnswer = matchAnswer;
    }
    if (type === 'mix') {
      const mixQuizAnswer = { id, answer: answers };
      newAnswer = mixQuizAnswer;
    }
    if (type === 'cloze') {
      const clozeAnswer = { id, answer_gaps: answers };
      newAnswer = clozeAnswer;
    }
    if (type === 'cross') {
      const crossAnswer = { id, rows: answers };
      newAnswer = crossAnswer;
    }
    if (allFalse === false) {
      tempQuestions[index] = newAnswer;
    }

    tempAnswers.questions = tempQuestions;
    this.setState({ answers: tempAnswers });
  }
  /*
    Decides to render a message explaining the user that the quizz has negative marking or not
  */
  isNegativeMarking() {
    if (this.state.quizInfo.negative_marking === true) {
      return 'This quiz contains negative marking';
    }
    return '';
  }
  /*
  Method that renders the submit panel containing different buttons
  according to the state in which the user is in ( ex: normal state: save, finnih,
  review state: back);
  */
  renderSubmitPanel() {
    if (this.state.reviewState && !this.state.resultsState) {
      return (
        <div className="submitPanel">
          <Button className="enjoy-css" onClick={this.isReviewMode}>BACK</Button>
          <Button className="enjoy-css" onClick={this.isResultsMode}>SUBMIT</Button>
        </div>);
    }
    if (this.state.savedSession && !this.state.reviewState && !this.state.resultsState) {
      return (
        <div className="submitPanel">
          <h5>
            { this.state.session.last_updated }
          </h5>
          <Button className="enjoy-css" onClick={this.isReviewMode}> FINISH</Button>
        </div>);
    }
    if (!this.state.reviewState && !this.state.resultsState && !this.state.savedSession) {
      return (
        <div className="submitPanel">
          <Button className="enjoy-css" onClick={this.saveSession}>
            SAVE
          </Button>
          <Button className="enjoy-css" onClick={this.isReviewMode}> FINISH</Button>
        </div>);
    } if (this.state.resultsState) {
      return (
        <div className="submitPanel">
          <h3>
           Score:
            {` ${this.state.score}/${this.state.totalScore} `}
            ({ parseFloat((this.state.score / this.state.totalScore) * 100).toFixed(2) }%)
          </h3>
        </div>
      );
    }
    return ('');
  }
  /*
   Method that renders the questions on the screen based on the array retrieved from the backend,
   and based on their type.
   @param question {Object} [question object as retrieved from the backend]
   @param index {Number} [index of the question]
  */
  renderQuestions(question, index) {
    let sessionAns = null;
    if (this.state.session.metadata !== null && this.state.session.metadata[question.id] !== null) {
      sessionAns = this.state.session.metadata[question.id];
    }
    if (question.type === 'multiple_choice') {
      return (
        <MultipleChoiceQuiz
          id={question.id}
          reviewState={this.state.reviewState}
          resultsState={this.state.resultsState}
          question={question}
          index={index}
          sessionAnswers={sessionAns}
          correctAnswer={this.state.data[question.id]}
          callbackParent={(questionId, answers) =>
          this.collectAnswers(questionId, answers, question.type, index)}
          key={`multiple_choice_quiz_${question.id}`}
        />
      );
    }
    if (question.type === 'single_choice') {
      return (
        <SingleChoiceQuiz
          id={question.id}
          reviewState={this.state.reviewState}
          resultsState={this.state.resultsState}
          question={question}
          index={index}
          sessionAnswers={sessionAns}
          correctAnswer={this.state.data[question.id]}
          callbackParent={(questionId, answers) =>
          this.collectAnswers(questionId, answers, question.type, index)}
          key={`single_choice_quiz_${question.id}`}
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
          sessionAnswers={sessionAns}
          correctAnswer={this.state.data[question.id]}
          callbackParent={(questionId, answers) =>
            this.collectAnswers(questionId, answers, question.type, index)}
          key={`match_quiz_${question.id}`}
        />
      );
    }
    if (question.type === 'mix') {
      return (
        <MixQuiz
          question={question}
          index={index}
          sessionAnswers={sessionAns}
          reviewState={this.state.reviewState}
          resultsState={this.state.resultsState}
          correctAnswer={this.state.data[question.id]}
          callbackParent={(questionId, answers) =>
          this.collectAnswers(questionId, answers, question.type, index)}
          key={`mix_quiz_${question.id}`}
        />
      );
    }

    if (question.type === 'cloze') {
      const hints = question.hints.map(h => ({
        gap: '',
        hint: h,
      }));
      const sentencesInEx = question.sentence.split('\n').map(sentence => ({
        text: sentence,
        gaps: hints.splice(0, getNOfGaps(sentence)),
      }));
      return (
        <ClozeQuestion
          id={question.id}
          key={index}
          points={question.points}
          index={index}
          reviewer={false}
          request={question.question}
          sentences={sentencesInEx}
          sessionAnswers={sessionAns ? sessionAns.answer_gaps : []}
          callbackParent={answers =>
            this.collectAnswers(question.id, answers, question.type, index)}
          studentReview={this.state.reviewState}
          resultsState={this.state.resultsState}
          correctAnswer={this.state.data[question.id]}
        />
      );
    }

    if (question.type === 'cross') {
      return (
        <CrossQuiz
          id={question.id}
          index={index}
          question={question}
          sessionAnswers={sessionAns}
          reviewState={this.state.reviewState}
          resultsState={this.state.resultsState}
          correctAnswer={this.state.data[question.id]}
          callbackParent={(questionId, answers) =>
            this.collectAnswers(questionId, answers, question.type, index)}
          key={`cross_quiz_${question.id}`}
        />
      );
    }
    return ('');
  }
  /*
    Render method.
  */
  render() {
    if (this.state.error) {
      return (<h1>ERROR</h1>);
    }
    if (this.state.loadingQuiz) {
      return <BrandSpinner />;
    }
    return (
      <div className="mainQuizViewerBlock">
        <h1 style={styles.quizTitle}>{this.state.quizInfo.title}</h1>
        <h5 style={styles.quizTile}>Created by: {this.state.quizInfo.creator}</h5>
        <h5 style={styles.quizTile}>{this.isNegativeMarking()}</h5>
        {this.state.quizInfo.questions.map((question, index) =>
        this.renderQuestions(question, index))
        }
        {this.renderSubmitPanel()}
      </div>
    );
  }
}

QuizViewerMainPage.propTypes = {
  userToken: React.PropTypes.shape({}).isRequired,
  quizID: React.PropTypes.string.isRequired,
  reloadSideBar: React.PropTypes.func,
  handleError: React.PropTypes.func,
};
QuizViewerMainPage.defaultProps = {
  reloadSideBar: null,
  handleError: null,
};
