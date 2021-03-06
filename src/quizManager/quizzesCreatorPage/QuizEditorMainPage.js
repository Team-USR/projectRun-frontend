import React, { Component, PropTypes } from 'react';
import { Button, Col } from 'react-bootstrap';
import axios from 'axios';
import Calendar from 'react-input-calendar';
import { MultipleChoiceQuizGenerator } from '../../createQuizzes/MultipleChoice';
import { SingleChoiceQuizGenerator } from '../../createQuizzes/SingleChoice';
import { MatchQuizGenerator } from '../../createQuizzes/Match';
import { ClozeGenerator } from '../../createQuizzes/Cloze';
import { MixQuizGenerator } from '../../createQuizzes/Mix';
import { CrossQuizGenerator } from '../../createQuizzes/Cross';
import { ButtonWrapper } from './index';
import { API_URL } from '../../constants';
import { BrandSpinner, ModalError } from '../../components/utils';
import { checkMatch, checkMix, checkMultiple, checkCloze, checkCross } from '../../helpers/Validators';

const styles = {
  loading: {
    textAlign: 'center',
    marginTop: 100,
  },
};
let id = 0;
let displayIndex = 0;
/*
 Wrapper component that enables a certain quiz to be eddited and saved.
*/
export default class QuizEditorMainPage extends Component {
  constructor() {
    super();
    this.state = {
      questions: [],
      inputQuestions: [{
      }],
      submitedQuestions: { quiz: { title: '', negative_marking: false, questions_attributes: [] } },
      generatedQuizID: 0,
      answers: { quiz: [] },
      reviewState: false,
      resultsState: false,
      loading: false,
      quizInfo: [],
      loadingQuiz: true,
      error: false,
      defaultDate: '01-01-2017',
      errors: { quiz: { title: '', questions_attributes: [] } },
      hasErrors: [],
      pointsErrors: false,
      attemptsErrors: false,
      showModal: false,
      modalContent: {
        header: 'Error!',
        body: 'The Quiz contains errors',
        buttons: ['close'],
        modalProps: {},
      },
    };
    this.isReviewMode = this.isReviewMode.bind(this);
    this.isResultsMode = this.isResultsMode.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.changeAttempts = this.changeAttempts.bind(this);
    this.changeReleaseDate = this.changeReleaseDate.bind(this);
    this.setNegativeMarking = this.setNegativeMarking.bind(this);
  }
  /*
    Makes a request in the backend in order to retrieve a quiz to be editted
    given the quizID parameter through props.
  */
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
       const generatedQuiz = this.state.submitedQuestions;
       generatedQuiz.quiz.title = response.data.title;
       generatedQuiz.quiz.attempts = response.data.attempts;
       generatedQuiz.quiz.release_date = response.data.release_date;
       generatedQuiz.quiz.negative_marking = response.data.negative_marking;
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
  /*
   Makes a new request when the component receives
  a new id and needs to render a new quiz on the screen
  @param nextProps@S
  */
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
        generatedQuiz.quiz.negative_marking = response.data.negative_marking;

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
  /*
    Resets the id of the displayed question when the component is unmounted from the screen.
  */
  componentWillUnmount() {
    id = 0;
    displayIndex = 0;
  }
  /*
    Edits the negative marking field
  */
  setNegativeMarking() {
    const value = this.state.submitedQuestions.quiz.negative_marking;
    const newValue = !value;
    const generatedQuiz = this.state.submitedQuestions;
    generatedQuiz.quiz.negative_marking = newValue;
    this.setState({ submitedQuestions: generatedQuiz });
  }
  /*
    Edits the points field.
    @param event
    @param index {Number} [index of the question that needs to have it's points updated]
  */
  setPoints(event, index) {
    let realScore = event.target.value;
    const e = event;
    if (isNaN(event.target.value) || event.target.value === '' || event.target.value === undefined || event.target.value === null) {
      e.target.value = '';
      realScore = 0;
    }
    const inputQ = this.state.submitedQuestions;
    if (inputQ.quiz.questions_attributes && inputQ.quiz.questions_attributes[index] &&
    inputQ.quiz.questions_attributes[index].points !== undefined) {
      inputQ.quiz.questions_attributes[index].points = realScore;
    } else {
      inputQ.quiz.questions_attributes[index] = { points: realScore };
    }
    this.setState({ submitedQuestions: inputQ });
  }
  /*
    Removes a question from the quiz and all of it's content.
    @param index {Number} [index of the question that needs to be removed]
  */
  removeQuiz(index) {
    const thisError = this.state.hasErrors;
    thisError[index + 1] = false;
    this.setState({ hasErrors: thisError });
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
  /*
    Validates the title of the quiz
    @return {String} error  message according to the input of the user
  */
  checkCorectnessTitle(generatedQuiz) {
    const thisObject = this.state.errors;
    thisObject.quiz.title = '';
    this.setState({ errors: thisObject, attemptsErrors: false, pointsErrors: false });
    if (generatedQuiz.quiz.title === '') {
      thisObject.quiz.title = 'Title is empty! \n';
      this.setState({ errors: thisObject });
      const thisError = this.state.hasErrors;
      thisError[0] = true;
      this.setState({ hasErrors: thisError });
    }
    if (generatedQuiz.quiz.title !== '') {
      thisObject.quiz.title = '';
      this.setState({ errors: thisObject });
      const thisError = this.state.hasErrors;
      thisError[0] = false;
      this.setState({ hasErrors: thisError });
    }
  }
  /*
    General validation method that calls separate other validation methods according to
    the type of the element that needs to be checked for errors
    @return {String} [error message]
  */
  checkCorectness(element, index) {
    const questions = this.state.submitedQuestions;
    let errorMessage = '';
    this.checkCorectnessTitle(questions);
    const thisObject = this.state.errors;
    if (element.type === 'match') {
      errorMessage = checkMatch(element);
    } else if (element.type === 'multiple_choice' || element.type === 'single_choice') {
      errorMessage += checkMultiple(element);
    } else if (element.type === 'mix') {
      errorMessage = checkMix(element);
    } else if (element.type === 'cloze') {
      errorMessage = checkCloze(element);
    } else if (element.type === 'cross') {
      errorMessage = checkCross(element);
    }
    if (errorMessage !== '') {
      const thisError = this.state.hasErrors;
      thisError[index + 1] = true;
      this.setState({ hasErrors: thisError });
    }
    if (errorMessage === '') {
      const thisError = this.state.hasErrors;
      thisError[index + 1] = false;
      this.setState({ hasErrors: thisError });
    }
    thisObject.quiz.questions_attributes[index] = errorMessage;
    this.setState({ errors: thisObject });
  }
  /*
    Prepares the final object in order to be saved to the backend
    Checks if the validations passes and no errors are currently displayed on the screen
    Then it makes the patch request to the backend and updates the quiz.
  */
  isReviewMode() {
    const sQuestions = this.state.submitedQuestions;
    const filteredQuestions = sQuestions.quiz.questions_attributes.filter(
        element => element !== null,
      );
    if (this.state.hasErrors.filter(item => item === true).length === 0 &&
      filteredQuestions.length > 0) {
      this.setState({ loading: true, submitedQuestions: filteredQuestions });
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
    } else {
      // window.alert('Quiz has errors');
      this.openModal({
        header: 'Oops! You\'ve missed something!',
        body: 'The quiz contains some blank spaces and cannot be submitted. Please check the fields!',
        buttons: ['ok'],
      });
    }
  }
  isResultsMode() {
    const newState = !this.state.resultsState;
    this.setState({ resultsState: newState });
  }
  /*
  Closes the modal
  */
  closeModal() {
    this.setState({ showModal: false });
  }
  /*
  Opens a modal given it's content.
  */
  openModal(content) {
    if (content) {
      this.setState({ showModal: true, modalContent: content });
    } else {
      this.setState({ showModal: true });
    }
  }
  /*
     Collects the question data when it is eddited or added to the quiz
  */
  collectObject(answersAttributes, question, type, questionID) {
    const inputQ = this.state.submitedQuestions;
    let pointsAssigned = 0;
    if (inputQ.quiz.questions_attributes[questionID] &&
       inputQ.quiz.questions_attributes[questionID].points) {
      pointsAssigned = inputQ.quiz.questions_attributes[questionID].points;
    }

    if (inputQ.quiz.questions_attributes[questionID] === undefined
      && this.state.quizInfo.questions[questionID]
      && this.state.quizInfo.questions[questionID].points) {
      pointsAssigned = this.state.quizInfo.questions[questionID].points;
    }
    let quiz = {};
    if (type === 'match') {
      quiz = {
        question: question.question,
        points: pointsAssigned,
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
      quiz = { question, type, points: pointsAssigned, answers_attributes: answersAttributes };
    } if (type === 'single_choice') {
      quiz = { question, type, points: pointsAssigned, answers_attributes: answersAttributes };
    }
    inputQ.quiz.questions_attributes[questionID] = quiz;
    this.checkCorectness(inputQ.quiz.questions_attributes[questionID], questionID);
    this.setState({ submitedQuestions: inputQ });
  }
  /*
  Separate method that collects data for the cloze question.
  */
  collectClozeObject(questionID, sentenceAttributes, gapsAttributes, questionTitle) {
    const inputQ = this.state.submitedQuestions;
    let pointsAssigned = 0;
    if (inputQ.quiz.questions_attributes[questionID] &&
       inputQ.quiz.questions_attributes[questionID].points) {
      pointsAssigned = inputQ.quiz.questions_attributes[questionID].points;
    }
    if (inputQ.quiz.questions_attributes[questionID] === undefined
      && this.state.quizInfo.questions[questionID]
      && this.state.quizInfo.questions[questionID].points) {
      pointsAssigned = this.state.quizInfo.questions[questionID].points;
    }
    const newQuestion = {
      question: questionTitle,
      type: 'cloze',
      points: pointsAssigned,
      cloze_sentence_attributes: {
        text: sentenceAttributes,
      },
      gaps_attributes: gapsAttributes,
    };

    inputQ.quiz.questions_attributes[questionID] = newQuestion;
    this.checkCorectness(inputQ.quiz.questions_attributes[questionID], questionID);
    this.setState({ submitedQuestions: inputQ });
  }
  /*
    Separate method that collects the data from the mix question
    @param data
    @param questionTitle
    @param questionID
  */
  collectMixObject(data, questionTitle, questionID) {
    const inputQ = this.state.submitedQuestions;
    let pointsAssigned = 0;
    if (inputQ.quiz.questions_attributes[questionID] &&
       inputQ.quiz.questions_attributes[questionID].points) {
      pointsAssigned = inputQ.quiz.questions_attributes[questionID].points;
    }

    if (inputQ.quiz.questions_attributes[questionID] === undefined
      && this.state.quizInfo.questions[questionID]
      && this.state.quizInfo.questions[questionID].points) {
      pointsAssigned = this.state.quizInfo.questions[questionID].points;
    }
    const questionObject = {
      question: questionTitle,
      type: 'mix',
      points: pointsAssigned,
      sentences_attributes: data,
    };
    inputQ.quiz.questions_attributes[questionID] = questionObject;
    this.checkCorectness(inputQ.quiz.questions_attributes[questionID], questionID);
    this.setState({ submitedQuestions: inputQ });
  }
  /*
    Collects the data from the Cross child component
  */
  collectCrossObject(question, metaAtributes, rowsAttributes, hintsAttributes, questionID) {
    const inputQ = this.state.submitedQuestions;
    let pointsAssigned = 0;
    if (inputQ.quiz.questions_attributes[questionID] &&
       inputQ.quiz.questions_attributes[questionID].points) {
      pointsAssigned = inputQ.quiz.questions_attributes[questionID].points;
    }
    if (inputQ.quiz.questions_attributes[questionID] === undefined
      && this.state.quizInfo.questions[questionID]
      && this.state.quizInfo.questions[questionID].points) {
      pointsAssigned = this.state.quizInfo.questions[questionID].points;
    }
    const newQuestion = {
      question,
      type: 'cross',
      points: pointsAssigned,
      metadata_attributes: metaAtributes,
      rows_attributes: rowsAttributes,
      hints_attributes: hintsAttributes,
    };
    inputQ.quiz.questions_attributes[questionID] = newQuestion;
    this.checkCorectness(inputQ.quiz.questions_attributes[questionID], questionID);
    this.setState({ submitedQuestions: inputQ });
  }
  /*
    Adds a question to the quiz depending on the type of question that the user
    wants to add.
  */
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

    if (quizType === 'cross') {
      const question = (
        <CrossQuizGenerator
          content={questionObj}
          reviewState={this.state.reviewState}
          resultsState={this.state.resultsState}
          index={id}
          key={`cross${id}`}
          updateParent={(questionTitle, metaAtributes, rowsAttributes, hintsAttributes, ind) =>
            this.collectCrossObject(
              questionTitle, metaAtributes, rowsAttributes, hintsAttributes, ind,
            )}
        />);
      questionObject = { id, question, buttonGroup };
    }

    inputQuestionList.push(inputQuestion);
    questionList.push(questionObject);
    this.setState({ questions: questionList, inputQuestions: inputQuestionList });
    id += 1;
  }
  scrollToBottom() {
    this.scroller2.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }
  /*
    Edits the title of the quiz
    @param event
  */
  changeTitle(event) {
    const generatedQuiz = this.state.submitedQuestions;
    generatedQuiz.quiz.title = event.target.value;
    this.setState({ submitedQuestions: generatedQuiz });
    this.checkCorectnessTitle(generatedQuiz);
  }
  /*
    Edits the number of attempts for the quiz.
  */
  changeAttempts(event) {
    let realAttempts = event.target.value;
    const e = event;
    if (isNaN(event.target.value) || event.target.value === '' || event.target.value === undefined || event.target.value === null) {
      e.target.value = '';
      realAttempts = 0;
    }
    const attempted = this.state.submitedQuestions;
    attempted.quiz.attempts = realAttempts;
    this.setState({ submitedQuestions: attempted });
    this.checkCorectnessTitle(attempted);
  }
  /*
    Edits the release date
  */
  changeReleaseDate(value) {
    const releaseDate = this.state.submitedQuestions;
    releaseDate.quiz.release_date = value;
    this.setState({ submitedQuestions: releaseDate, defaultDate: value });
  }
  /*
    Calls the render group method while mapping through the array of questions.
  */
  renderQuestions() {
    displayIndex = 0;
    return (
      this.state.questions.map((object, index) =>
         this.renderGroup(object, index))
    );
  }
  /*
    Decides if to render or not an error on a specific question
    @param index {Number} [index of the question that has to be checked for errors]
  */
  renderQuestionError(index) {
    if (this.state.errors.quiz.questions_attributes &&
      this.state.errors.quiz.questions_attributes[index] !== undefined) {
      return this.state.errors.quiz.questions_attributes[index];
    }
    return '';
  }
  /*
  Renders a block containing an index for a question , the main block of the question,
  the points field and the delete button
  */
  renderGroup(object, index) {
    if (this.state.questions[index]) {
      displayIndex += 1;
      let points = null;
      if (this.state.quizInfo.questions && this.state.quizInfo.questions[index]) {
        points = this.state.quizInfo.questions[index].points;
      }
      return (
        <div className="cardSection" key={`generator${displayIndex}`}>
          <h2>{displayIndex}</h2>
          {this.state.questions[index].question}

          <Col md={12} className="general_points_container">
            <Col md={12} className="points_container">
              <div className="points_wrapper">
                <label htmlFor="pointIn">
                  <h5>Score:</h5>
                </label>
              </div>
              <div className="points_wrapper">
                <input
                  className="form-control"
                  id="pointIn"
                  placeholder="ex: 10"
                  type="number"
                  defaultValue={points}
                  onChange={event => this.setPoints(event, index)}
                />
              </div>
            </Col>
          </Col>
          <div>
            <h5 className="error_message">{this.renderQuestionError(index)}</h5>
          </div>
          {this.state.questions[index].buttonGroup}
        </div>
      );
    }
    return ('');
  }
  /*
   Returns a panel containing the edit and save buttons
  */
  renderSubmitPanel() {
    if (this.state.reviewState && !this.state.resultsState) {
      return (
        <div className="submitPanel">
          <Button className="enjoy-css" onClick={this.isReviewMode}>Edit</Button>
        </div>);
    }
    if (!this.state.reviewState && !this.state.resultsState) {
      return (
        <div className="submitPanel">
          <Button className="enjoy-css" onClick={this.isReviewMode}> Save</Button>
        </div>);
    } if (this.state.resultsState) {
      return (
        <div className="submitPanel" />
      );
    }

    return ('');
  }
  /*
  Main render function
  */
  render() {
    const submit = this.state.submitedQuestions;
    if (this.state.error === true) {
      return (<div className="mainQuizViewerBlock" style={styles.loading}>
        <h1>Connection error...</h1>
      </div>);
    } else
    if (this.state.loadingQuiz === true) {
      return <BrandSpinner />;
    } else
    if (!this.state.reviewState && this.state.loading === false) {
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
                    className="form-control"
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
                    className="form-control"
                    id="attemptsInput"
                    type="number"
                    placeholder="ex: 10 (0 = ∞)"
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
              <Col md={12}>
                <Col md={6}>
                  <h5 className="headingLabel">Negative marking:</h5>
                </Col>
                <Col md={6} style={{ textAlign: 'left', marginTop: 5 }}>
                  <input
                    id="negativeMarkingBox"
                    type="checkbox"
                    defaultValue={this.state.submitedQuestions.quiz.negative_marking}
                    onChange={this.setNegativeMarking}
                  />
                </Col>
              </Col>
              <Col md={12}>
                {
                this.state.errors.quiz.title.split('\n').map((errtext, i) =>
                  <h5 className="error_message" key={`errorTitle${i + 1}`}>{errtext}</h5>)}
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
            <Button onClick={() => this.addQuiz('cross', null)}>Cross</Button>
          </div>
          <div
            style={{ float: 'left', clear: 'both' }}
            ref={(input) => { this.scroller2 = input; }}
          />

          <ModalError
            show={this.state.showModal}
            content={this.state.modalContent}
            close={() => this.closeModal()}
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
