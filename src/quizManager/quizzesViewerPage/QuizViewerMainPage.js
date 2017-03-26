import React, { Component } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { MultipleChoiceQuiz } from '../../quizzes/MultipleChoice';
import { SingleChoiceQuiz } from '../../quizzes/SingleChoice';
import { MatchQuiz } from '../../quizzes/Match/';
import { ClozeQuestion } from '../../quizzes/Cloze';
import { MixQuiz } from '../../quizzes/Mix/';
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
  componentWillMount() {
//    console.log("mount");
    axios({
      url: `${API_URL}/quizzes/${this.props.quizID}`,
      headers: this.props.userToken,
    })
    .then(response => setTimeout(() => {
      this.setState({
        loadingQuiz: false,
        quizInfo: response.data.quiz,
        session: response.data.quiz_session,
      //  answers: response.data.quiz_session,
      });
      this.loadSession();
    }, 510))
    .catch(() => {
      this.setState({ error: true });
      this.props.handleError('default');
    });
  }

  componentWillReceiveProps(nextProps) {
  //  console.log("HOLA");
  //  console.log("SESSSION", this.state.session);
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
        //  answers: response.data.quiz_session,
        });
        this.loadSession();
      }, 510));
    }
  }
  isReviewMode() {
    const newState = !this.state.reviewState;
    this.setState({ reviewState: newState });
  }
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
      }
      return (null);
    });

    const q = { questions: quest };
    this.setState({ answers: q });
  }
  saveSession() {
  //  this.setState({ loadingQuiz: true });
    // console.log(this.state.answers);
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
    // console.log("POST: ", this.state.answers);
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
      // console.log(this.state.score);
    });
  }
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

    if (allFalse === false) {
      tempQuestions[index] = newAnswer;
    }

    tempAnswers.questions = tempQuestions;
    this.setState({ answers: tempAnswers });
  }
  isNegativeMarking() {
    if (this.state.quizInfo.negative_marking === true) {
      return 'This quiz contains negative marking';
    }
    return '';
  }
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
            ({ (this.state.score / this.state.totalScore) * 100 }%)
          </h3>
        </div>
      );
    }
    return ('');
  }
  renderQuestions(question, index) {
  //  console.log(this.state.data[question.id]);
  //  console.log(this.state.answers);
  // console.log(this.state.session);
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
    return ('');
  }
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
