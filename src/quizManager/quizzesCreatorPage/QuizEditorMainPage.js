import React, { Component, PropTypes } from 'react';
import { Button, Col } from 'react-bootstrap';
import axios from 'axios';
import Calendar from 'react-input-calendar';
import { MultipleChoiceQuizGenerator } from '../../createQuizzes/MultipleChoice';
import { SingleChoiceQuizGenerator } from '../../createQuizzes/SingleChoice';
import { MatchQuizGenerator } from '../../createQuizzes/Match';
import { ClozeGenerator } from '../../createQuizzes/Cloze';
import { MixQuizGenerator } from '../../createQuizzes/Mix';
import { ButtonWrapper } from './index';
import { API_URL } from '../../constants';
import { BrandSpinner } from '../../components/utils';


const styles = {
  loading: {
    textAlign: 'center',
    marginTop: 100,
  },
};
let id = 0;
let displayIndex = 0;
export default class QuizEditorMainPage extends Component {
  constructor() {
    super();
    this.state = {
      questions: [],
      inputQuestions: [{
      }],
      submitedQuestions: { quiz: { title: '', questions_attributes: [] } },
      generatedQuizID: 0,
      answers: { quiz: [] },
      reviewState: false,
      resultsState: false,
      loading: false,
      quizInfo: [],
      loadingQuiz: true,
      error: false,
      defaultDate: '01-01-2017',
    };
    this.isReviewMode = this.isReviewMode.bind(this);
    this.isResultsMode = this.isResultsMode.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.changeAttempts = this.changeAttempts.bind(this);
    this.changeReleaseDate = this.changeReleaseDate.bind(this);
  }
  componentWillMount() {
    id = 0;
    this.setState({ loadingQuiz: true });
    axios({
      url: `${API_URL}/quizzes/${this.props.quizID}/edit`,
      headers: this.props.userToken,
    })
     .then((response) => {
       if (!response || (response && response.status !== 200)) {
         this.setState({ errorState: true });
       }
       console.log(response.data.release_date);
       const generatedQuiz = this.state.submitedQuestions;
       generatedQuiz.quiz.title = response.data.title;
       generatedQuiz.quiz.attempts = response.data.attempts;
       generatedQuiz.quiz.release_date = response.data.release_date;
     //  console.log("LOADING FINISHED");
       setTimeout(() => {
         this.setState({
           loadingQuiz: false,
         });
       }, 510);
       this.setState({
         quizInfo: response.data,
         submitedQuestions: generatedQuiz,
       });
       response.data.questions.map(questionObj => this.addQuiz(questionObj.type, questionObj));
     })
     .catch(() => {
       this.setState({ error: true });
       this.props.handleError('default');
     });
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.quizID !== nextProps.quizID) {
      this.setState({ loadingQuiz: true });
      axios({
        url: `${API_URL}/quizzes/${nextProps.quizID}/edit`,
        headers: this.props.userToken,
      })
      .then((response) => {
        if (!response || (response && response.status !== 200)) {
          this.setState({ errorState: true });
        }
        const generatedQuiz = this.state.submitedQuestions;
        generatedQuiz.quiz.title = response.data.title;
        generatedQuiz.quiz.attempts = response.data.attempts;
        generatedQuiz.quiz.release_date = response.data.release_date;
        setTimeout(() => {
          this.setState({
            loadingQuiz: false,
          });
        }, 510);
        this.setState({
          quizInfo: response.data, submitedQuestions: generatedQuiz });
        response.data.questions.map(questionObj => this.addQuiz(questionObj.type, questionObj));
      });
    }
  }
  // componentDidUpdate() {
  //   this.scrollToBottom();
  // }
  removeQuiz(index) {
    displayIndex = 0;
    const remQuestions = this.state.questions;
    remQuestions[index] = null;
    const sQuestions = this.state.submitedQuestions;
    sQuestions.quiz.questions_attributes[index] = null;
    this.setState({ questions: remQuestions, submitedQuestions: sQuestions });
  }
  handleInput(questionI, answers, i) {
    if (answers) {
      const inputQuestion = this.state.inputQuestions;
      inputQuestion[i].answers = answers;
      this.setState({ inputQuestions: inputQuestion });
    }
  }
  isReviewMode() {
    const sQuestions = this.state.submitedQuestions;
  //  console.log("submitedQuestions ", sQuestions,"finishsubmited");
    const filteredQuestions = sQuestions.quiz.questions_attributes.filter(
      element => element !== null,
    );
    // console.log('filtered', filteredQuestions, 'finishfiltered');
    this.setState({ loading: true, submitedQuestions: filteredQuestions });
//    console.log("----------");
//    console.log(filteredQuestions);
//    console.log("----------");
    axios({
      url: `${API_URL}/quizzes/${this.props.quizID}`,
      data: this.state.submitedQuestions,
      headers: this.props.userToken,
      method: 'patch',
    })
     .then((response) => {
       if (!response || (response && response.status !== 201)) {
         this.setState({ errorState: true });
       }

       this.props.handleSubmitButton();
     });
  }
  isResultsMode() {
    const newState = !this.state.resultsState;
    this.setState({ resultsState: newState });
  }

  collectObject(answersAttributes, question, type, questionID) {
    const inputQ = this.state.submitedQuestions;

    let quiz = {};
    if (type === 'match') {
      quiz = {
        question: question.question,
        match_default_attributes: {
          default_text: question.match_default,
        },
        type,
        pairs_attributes: answersAttributes,
      };
      if (!question.match_default) {
        quiz.match_default_attributes.default_text = 'Choose an option';
      }
    } if (type === 'multiple_choice') {
      quiz = { question, type, answers_attributes: answersAttributes };
    } if (type === 'single_choice') {
      quiz = { question, type, answers_attributes: answersAttributes };
    }

    inputQ.quiz.questions_attributes[questionID] = quiz;
    this.setState({ submitedQuestions: inputQ });
  }

  collectClozeObject(questionID, sentenceAttributes, gapsAttributes) {
    const newQuestion = {
      question: 'Fill in the gaps:',
      type: 'cloze',
      cloze_sentence_attributes: {
        text: sentenceAttributes,
      },
      gaps_attributes: gapsAttributes,
    };
    const inputQ = this.state.submitedQuestions;
    inputQ.quiz.questions_attributes[questionID] = newQuestion;
    this.setState({ submitedQuestions: inputQ });
  }

  collectMixObject(data, questionTitle, questionID) {
    const questionObject = {
      question: questionTitle,
      type: 'mix',
      sentences_attributes: data,
    };
    const inputQ = this.state.submitedQuestions;
    inputQ.quiz.questions_attributes[questionID] = questionObject;
    this.setState({ submitedQuestions: inputQ });
    // console.log(questionObject);
  }

  addQuiz(quizType, questionObj) {
    displayIndex = 0;
    const buttonGroup = (
      <div className="">
        <ButtonWrapper
          index={id}
          key={id}
          removeQuiz={index => this.removeQuiz(index)}
        />
      </div>);
    let questionObject = { id };
    const questionList = this.state.questions;
    const inputQuestionList = this.state.inputQuestions;
    const ques = '';
    const answ = '';
    const inputQuestion = { id, ques, answ };
    if (quizType === 'multiple_choice') {
      const question = (
        <MultipleChoiceQuizGenerator
          handleInput={(questionI, answers) => this.handleInput(questionI, answers, id)}
          content={questionObj}
          index={id}
          key={`multiple_choice${id}`}
          updateParent={(answersAttributes, qObject, ind) =>
            this.collectObject(answersAttributes, qObject, 'multiple_choice', ind)}
        />);
      questionObject = { id, question, buttonGroup };
    }
    if (quizType === 'single_choice') {
      const question = (
        <SingleChoiceQuizGenerator
          handleInput={(questionI, answers) => this.handleInput(questionI, answers, id)}
          content={questionObj}
          index={id}
          key={`single_choice${id}`}
          updateParent={(answersAttributes, qObject, ind) =>
          this.collectObject(answersAttributes, qObject, 'single_choice', ind)}
        />);
      questionObject = { id, question, buttonGroup };
    }

    if (quizType === 'match') {
      const newQuestion = questionObj;

      if (questionObj) {
        const pairs = newQuestion.pairs;
        const newPairs = pairs.map((obj) => {
          const item = { right_choice: obj.right_choice, left_choice: obj.left_choice };
          return item;
        });
        newQuestion.pairs = newPairs;
      }

      const question = (
        <MatchQuizGenerator
          content={newQuestion}
          reviewState={this.state.reviewState}
          resultsState={this.state.resultsState}
          index={id}
          key={`match${id}`}
          updateParent={(answersAttributes, qObject, ind) =>
            this.collectObject(answersAttributes, qObject, 'match', ind)}
        />);
      questionObject = { id, question, buttonGroup };
    }

    if (quizType === 'cloze') {
      const question = (
        <ClozeGenerator
          reviewState={this.state.reviewState}
          resultsState={this.state.resultsState}
          updateParent={(questionID, qSent, sentenceAttributes, gapsAttributes) =>
            this.collectClozeObject(questionID, qSent, sentenceAttributes, gapsAttributes)}
          editorContent={questionObj}
          index={id}
          key={`cloze${id}`}
        />);
      questionObject = { id, question, buttonGroup };
    }

    if (quizType === 'mix') {
      //  console.log(questionObj);
      const question = (
        <MixQuizGenerator
          content={questionObj}
          reviewState={this.state.reviewState}
          resultsState={this.state.resultsState}
          index={id}
          key={`mix${id}`}
          updateParent={(answersAttributes, qObject, ind) =>
            this.collectMixObject(answersAttributes, qObject, ind)}
        />);
      questionObject = { id, question, buttonGroup };
    }

    inputQuestionList.push(inputQuestion);
    questionList.push(questionObject);

    // console.log(questionList);
    this.setState({ questions: questionList, inputQuestions: inputQuestionList });
    id += 1;
  }
  scrollToBottom() {
    this.scroller2.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }
  changeTitle(event) {
    const generatedQuiz = this.state.submitedQuestions;
    generatedQuiz.quiz.title = event.target.value;
    this.setState({ submitedQuestions: generatedQuiz });
//    console.log(this.state.submitedQuestions);
  }
  changeAttempts(event) {
    const attempted = this.state.submitedQuestions;
    attempted.quiz.attempts = event.target.value;
    this.setState({ submitedQuestions: attempted });
  }
  changeReleaseDate(value) {
    console.log(value);
    const releaseDate = this.state.submitedQuestions;
    releaseDate.quiz.release_date = value;
    this.setState({ submitedQuestions: releaseDate, defaultDate: value });
  }
  renderQuestions() {
    displayIndex = 0;
    return (
      this.state.questions.map((object, index) =>
         this.renderGroup(object, index))
    );
  }
  renderGroup(object, index) {
    if (this.state.questions[index]) {
      displayIndex += 1;
      return (
        <div className="generatorQuizContainer" key={`generator${displayIndex}`}>
          <h2>{displayIndex}</h2>
          {this.state.questions[index].question}
          {this.state.questions[index].buttonGroup}
        </div>
      );
    }
    return ('');
  }

  renderSubmitPanel() {
    if (this.state.reviewState && !this.state.resultsState) {
      return (
        <div className="submitPanel">
          <Button className="submitButton" onClick={this.isReviewMode}>EDIT QUIZ</Button>
        </div>);
    }
    if (!this.state.reviewState && !this.state.resultsState) {
      return (
        <div className="submitPanel">
          <Button className="submitButton" onClick={this.isReviewMode}> Save</Button>
        </div>);
    } if (this.state.resultsState) {
      return (
        <div className="submitPanel" />
      );
    }

    return ('');
  }
  render() {
  //  console.log(this.state.submitedQuestions);
  //  console.log("start rendering");
//  console.log("submiteed",this.state.submitedQuestions);
    const submit = this.state.submitedQuestions;
  //  console.log(this.state.questions);
  //  console.log("end rendering");
    if (this.state.error === true) {
      return (<div className="mainQuizViewerBlock" style={styles.loading}>
        <h1>Connection error...</h1>
      </div>);
    } else
    if (this.state.loadingQuiz === true) {
      return <BrandSpinner />;
    } else
    if (!this.state.reviewState && this.state.loading === false) {
    //  console.log("ATTEMPTS", submit.quiz.attempts);
    //  console.log("TITLE",submit.quiz.title);
      return (
        <div className="mainQuizGeneratorBlock">
          <h1> Quiz editor </h1>
          <label htmlFor="titleInput">
            <div className="headingWrapper">
              <Col md={12}>
                <Col md={6}>
                  <h5 className="headingLabel">  Title: </h5>
                </Col>
                <Col md={6}>
                  <input
                    id="titleInputs"
                    type="text"
                    key={'title'}
                    placeholder="ex: Spanish test"
                    onChange={this.changeTitle}
                    value={submit.quiz.title}
                  />
                </Col>
              </Col>
              <Col md={12}>
                <Col md={6}>
                  <h5 className="headingLabel">Number of attempts:</h5>
                </Col>
                <Col md={6}>
                  <input
                    id="attemptsInput"
                    type="number"
                    placeholder="ex: 10"
                    onChange={this.changeAttempts}
                    value={submit.quiz.attempts}
                  />
                </Col>
              </Col>
              <Col md={12}>
                <Col md={6}>
                  <h5 className="headingLabel">  Release date: </h5>
                </Col>
                <Col md={6}>
                  <Calendar key={'calendar'} format="DD/MM/YYYY" date={this.state.submitedQuestions.quiz.release_date} onChange={this.changeReleaseDate} computableFormat={'YYYY-MM-DD'} />
                </Col>
              </Col>
            </div>
          </label>
          <br /><br />
          {this.renderQuestions()}
          <br /><br /><br />
          { this.renderSubmitPanel() }
          Select a quiz to be added:
          <br />
          <div className="quizButtons">
            <Button onClick={() => this.addQuiz('multiple_choice', null)}> Multiple Choice</Button>
            <Button onClick={() => this.addQuiz('single_choice', null)}> Single Choice</Button>
            <Button onClick={() => this.addQuiz('match', null)}>Match</Button>
            <Button onClick={() => this.addQuiz('cloze', null)}>Cloze</Button>
            <Button onClick={() => this.addQuiz('mix', null)}>Mix</Button>
          </div>
          <div
            style={{ float: 'left', clear: 'both' }}
            ref={(input) => { this.scroller2 = input; }}
          />
        </div>
      );
    } else
    if (this.state.loading === true) {
      return <BrandSpinner />;
    }
    return ('');
  }
}
QuizEditorMainPage.propTypes = {
  userToken: React.PropTypes.shape({}).isRequired,
  handleSubmitButton: PropTypes.func.isRequired,
  quizID: PropTypes.string.isRequired,
  handleError: PropTypes.func,
};
QuizEditorMainPage.defaultProps = {
  handleError: null,
};
