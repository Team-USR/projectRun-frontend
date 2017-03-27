import React, { Component, PropTypes } from 'react';
import { Button, Col } from 'react-bootstrap';
import axios from 'axios';
import Calendar from 'react-input-calendar';
import { MultipleChoiceQuizGenerator } from '../../createQuizzes/MultipleChoice';
import { SingleChoiceQuizGenerator } from '../../createQuizzes/SingleChoice';
import { MatchQuizGenerator } from '../../createQuizzes/Match';
import { MixQuizGenerator } from '../../createQuizzes/Mix';
import { ClozeGenerator } from '../../createQuizzes/Cloze';
import { CrossQuizGenerator } from '../../createQuizzes/Cross';
import { ButtonWrapper } from './index';
import { API_URL } from '../../constants';
import { BrandSpinner, ModalError } from '../../components/utils';
import { checkMix, checkMultiple, checkCloze } from '../../helpers/Validators';

const styles = {
  loading: {
    textAlign: 'center',
    marginTop: 100,
  },
};
let id = 0;
let displayIndex = 0;
export default class QuizCreatorMainPage extends Component {
  constructor() {
    super();
    this.state = {
      questions: [],
      inputQuestions: [{
      }],
      submitedQuestions: { quiz: { title: '', questions_attributes: [], negative_marking: false, release_date: '01-01-2017' } },
      generatedQuizID: 0,
      answers: { quiz: [] },
      reviewState: false,
      resultsState: false,
      loading: false,
      errorState: false,
      defaultDate: '01-01-2017',
      errors: { quiz: { title: '', questions_attributes: [] } },
      hasErrors: [],
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
  componentWillUnmount() {
    id = 0;
    displayIndex = 0;
  }
  setNegativeMarking() {
    const value = this.state.submitedQuestions.quiz.negative_marking;
    const newValue = !value;
    const generatedQuiz = this.state.submitedQuestions;
    generatedQuiz.quiz.negative_marking = newValue;
    this.setState({ submitedQuestions: generatedQuiz });
  }
  setPoints(event, index) {
    const inputQ = this.state.submitedQuestions;
    if (inputQ.quiz.questions_attributes && inputQ.quiz.questions_attributes[index] &&
    inputQ.quiz.questions_attributes[index].points !== undefined) {
      inputQ.quiz.questions_attributes[index].points = event.target.value;
    } else {
      inputQ.quiz.questions_attributes[index] = { points: event.target.value };
    }

    this.setState({ submitedQuestions: inputQ });
  }

  // checkMix(element) {
  //   return "da";
  // }

  checkCorectnessTitle(generatedQuiz) {
    if (generatedQuiz.quiz.title === '') {
      const thisObject = this.state.errors;
      thisObject.quiz.title = 'Title is empty!';
      this.setState({ errors: thisObject });
      const thisError = this.state.hasErrors;
      thisError[0] = true;
      this.setState({ hasErrors: thisError });
    }
    if (generatedQuiz.quiz.title !== '') {
      const thisObject = this.state.errors;
      thisObject.quiz.title = '';
      this.setState({ errors: thisObject });
      const thisError = this.state.hasErrors;
      thisError[0] = false;
      this.setState({ hasErrors: thisError });
    }
  }
  checkCorectness(element, index) {
    const questions = this.state.submitedQuestions;
    let errorMessage = '';
    this.checkCorectnessTitle(questions);
    const thisObject = this.state.errors;
    if (element.type === 'match') {
      // TODO: check for errors method(element)
      //  errorMessage = this.checkMatch(element); --returns string describing error
    } else if (element.type === 'multiple_choice' || element.type === 'single_choice') {
      errorMessage = checkMultiple(element);
    } else if (element.type === 'mix') {
      errorMessage = checkMix(element);
    } else if (element.type === 'cloze') {
      errorMessage = checkCloze(element);
    } else if (element.type === 'cross') {
        // TODO: check for errors
        //  errorMessage = this.checkCross(element); --returns string describing error
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

  isReviewMode() {
    if (this.state.hasErrors.filter(item => item === true).length === 0) {
      const sQuestions = this.state.submitedQuestions;
  //    console.log("submitedQuestions ", sQuestions,"finishsubmited");
      const filteredQuestions = sQuestions.quiz.questions_attributes.filter(element =>
       element !== null);
  //    console.log("filtered ",filteredQuestions," finishfiltered");
      this.setState({ submitedQuestions: filteredQuestions });
    //  console.log("----------");
    //  console.log(this.state.submitedQuestions);
  //  console.log("----------");
      axios({
        url: `${API_URL}/quizzes`,
        headers: this.props.userToken,
        method: 'post',
        data: this.state.submitedQuestions,
      })
      .then((response) => {
      //  const resultID = response.data.id;
      //  console.log("Result id", resultID);
        if (!response || (response && response.status !== 200)) {
          this.setState({ errorState: true });
        }
        this.props.handlePublish(response.data.id.toString());
        this.props.handleSubmitButton();
    //    this.setState({ generatedQuizID: resultID, loading: loadingFalse });
      });
    } else {
      // window.alert('Quiz has errors');
      this.openModal({
        header: 'Oops! You\'ve missed something!',
        body: 'The quiz contains some blank spaces and cannot be submitted. Please check the fields!',
        buttons: ['close'],
      });
    }
  }
  isResultsMode() {
    const newState = !this.state.resultsState;
    this.setState({ resultsState: newState });
  }

  closeModal() {
    this.setState({ showModal: false });
  }

  openModal(content) {
    if (content) {
      this.setState({ showModal: true, modalContent: content });
    } else {
      this.setState({ showModal: true });
    }
  }

  collectObject(answersAttributes, question, type, questionID) {
    const inputQ = this.state.submitedQuestions;
    let pointsAssigned = 0;
    if (inputQ.quiz.questions_attributes[questionID] &&
       inputQ.quiz.questions_attributes[questionID].points) {
      pointsAssigned = inputQ.quiz.questions_attributes[questionID].points;
    }
    // if (inputQ.quiz.questions_attributes[questionID] === undefined) {
    //   pointsAssigned = this.state.quizInfo.questions[questionID].points;
    // }

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
    } if (type === 'multiple_choice') {
      quiz = { question, type, points: pointsAssigned, answers_attributes: answersAttributes };
    } if (type === 'single_choice') {
      quiz = { question, type, points: pointsAssigned, answers_attributes: answersAttributes };
    }

    inputQ.quiz.questions_attributes[questionID] = quiz;
    this.checkCorectness(inputQ.quiz.questions_attributes[questionID], questionID);
    this.setState({ submitedQuestions: inputQ });
  }

  collectCrossObject(question, metaAtributes, rowsAttributes, hintsAttributes, questionID) {
    const inputQ = this.state.submitedQuestions;
    let pointsAssigned = 0;
    if (inputQ.quiz.questions_attributes[questionID] &&
       inputQ.quiz.questions_attributes[questionID].points) {
      pointsAssigned = inputQ.quiz.questions_attributes[questionID].points;
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
    this.setState({ submitedQuestions: inputQ });
  }

  collectClozeObject(questionID, sentenceAttributes, gapsAttributes, questionTitle) {
    const inputQ = this.state.submitedQuestions;
    let pointsAssigned = 0;
    if (inputQ.quiz.questions_attributes[questionID] &&
       inputQ.quiz.questions_attributes[questionID].points) {
      pointsAssigned = inputQ.quiz.questions_attributes[questionID].points;
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

  collectMixObject(data, questionTitle, questionID) {
    const inputQ = this.state.submitedQuestions;
    let pointsAssigned = 0;
    if (inputQ.quiz.questions_attributes[questionID] &&
       inputQ.quiz.questions_attributes[questionID].points) {
      pointsAssigned = inputQ.quiz.questions_attributes[questionID].points;
    }
    // if (inputQ.quiz.questions_attributes[questionID] === undefined) {
    //   pointsAssigned = this.state.quizInfo.questions[questionID].points;
    // }
    const questionObject = {
      question: questionTitle,
      type: 'mix',
      points: pointsAssigned,
      sentences_attributes: data,
    };
    inputQ.quiz.questions_attributes[questionID] = questionObject;
    this.checkCorectness(inputQ.quiz.questions_attributes[questionID], questionID);
    this.setState({ submitedQuestions: inputQ });
    //  console.log(inputQ);
    // console.log(questionObject);
  }

  addQuiz(quizType) {
  //  console.log(id);

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
    //  console.log(id);
      const question = (
        <MultipleChoiceQuizGenerator
          handleInput={(questionI, answers) => this.handleInput(questionI, answers, id)}
          content={null}
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
          content={null}
          index={id}
          key={`single_choice${id}`}
          updateParent={(answersAttributes, qObject, ind) =>
            this.collectObject(answersAttributes, qObject, 'single_choice', ind)}
        />);
      questionObject = { id, question, buttonGroup };
    }

    if (quizType === 'match') {
      const question = (
        <MatchQuizGenerator
          content={null}
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
          updateParent={(questionID, qSent, sentenceAttributes, gapsAttributes) =>
            this.collectClozeObject(questionID, qSent, sentenceAttributes, gapsAttributes)}
          index={id}
          key={`cloze${id}`}
        />);
      questionObject = { id, question, buttonGroup };
    }

    if (quizType === 'cross') {
      const question = (
        <CrossQuizGenerator
          updateParent={(questionTitle, metaAtributes, rowsAttributes, hintsAttributes, ind) =>
            this.collectCrossObject(
              questionTitle, metaAtributes, rowsAttributes, hintsAttributes, ind,
            )}
          index={id}
          key={`cross${id}`}
        />);
      questionObject = { id, question, buttonGroup };
    }

    if (quizType === 'mix') {
      const question = (
        <MixQuizGenerator
          index={id}
          key={`mix${id}`}
          updateParent={(answersAttributes, qObject, ind) =>
          this.collectMixObject(answersAttributes, qObject, ind)}
        />);
      questionObject = { id, question, buttonGroup };
    }

    inputQuestionList.push(inputQuestion);
    questionList.push(questionObject);
    this.setState({ questions: questionList, inputQuestions: inputQuestionList });
    id += 1;
  }
  scrollToBottom() {
    this.scroller.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }
  changeTitle(event) {
    const generatedQuiz = this.state.submitedQuestions;
    generatedQuiz.quiz.title = event.target.value;
    this.setState({ submitedQuestions: generatedQuiz });
    this.checkCorectnessTitle(generatedQuiz);
  }
  changeAttempts(event) {
    const attempted = this.state.submitedQuestions;
    attempted.quiz.attempts = event.target.value;
    this.setState({ submitedQuestions: attempted });
  }
  changeReleaseDate(value) {
    const releaseDate = this.state.submitedQuestions;
    releaseDate.quiz.release_date = value;
    this.setState({ submitedQuestions: releaseDate, defaultDate: value });
  }
  handleInput(questionI, answers, i) {
    if (answers) {
      const inputQuestion = this.state.inputQuestions;
      inputQuestion[i].answers = answers;
      this.setState({ inputQuestions: inputQuestion });
    }
  }
  removeQuiz(index) {
    displayIndex = 0;
    const remQuestions = this.state.questions;
    remQuestions[index] = null;
    const sQuestions = this.state.submitedQuestions;
    sQuestions.quiz.questions_attributes[index] = null;
    this.setState({ questions: remQuestions, submitedQuestions: sQuestions });
  }

  renderQuestionError(index) {
    if (this.state.errors.quiz.questions_attributes &&
      this.state.errors.quiz.questions_attributes[index] !== undefined) {
      return this.state.errors.quiz.questions_attributes[index];
    }
    return '';
  }

  renderGroup(object, index) {
    if (this.state.questions[index]) {
      displayIndex += 1;
      return (
        <div className="cardSection" key={`generatorQuizContainer${displayIndex}`}>
          <h3>{displayIndex}</h3>
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
                  onChange={event => this.setPoints(event, index)}
                />
              </div>
            </Col>
          </Col>
          <div>
            {this.renderQuestionError(index).split('\n').map((errtext, i) =>
              <h5 className="error_message" key={`errtext${index}${i + 1}`}>{errtext}</h5>)}
          </div>
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
          <Button className="enjoy-css" onClick={this.isReviewMode}>Edit</Button>
        </div>);
    }
    if (!this.state.reviewState && !this.state.resultsState && this.state.questions.length > 0) {
      return (
        <div className="submitPanel">
          <Button className="enjoy-css" onClick={this.isReviewMode}>Save</Button>
        </div>);
    } if (this.state.resultsState) {
      return (
        <div className="submitPanel" />
      );
    }

    return ('');
  }
  renderQuestions() {
    displayIndex = 0;
    return (
      this.state.questions.map((object, index) =>
         this.renderGroup(object, index))
    );
  }
  render() {
    if (this.state.errorState === true) {
      return (<div className="mainQuizViewerBlock" style={styles.loading}>
        <h1>Connection error...</h1>
      </div>);
    } else
    if (this.state.loading === true) {
      return (<BrandSpinner />);
    }
    if (!this.state.reviewState && this.state.loading === false) {
      return (
        <div className="mainQuizGeneratorBlock">
          <h1> Quiz creator </h1>
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
                  />
                </Col>
              </Col>
              <Col md={12}>
                <Col md={6}>
                  <h5 className="headingLabel">  Release date: </h5>
                </Col>
                <Col md={6}>
                  <Calendar key={'calendar'} format="DD/MM/YYYY" date={this.state.defaultDate} onChange={this.changeReleaseDate} computableFormat={'YYYY-MM-DD'} />
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
                    onChange={this.setNegativeMarking}
                  />
                </Col>
              </Col>
              <Col md={12}>
                <h5 className="error_message">{this.state.errors.quiz.title} </h5>
              </Col>
            </div>
          </label>
          <br /><br />
          {this.renderQuestions()}
          <br /><br /><br />
          Select a quiz to be added:
          <br />
          <div className="quizButtons">
            <Button onClick={() => this.addQuiz('multiple_choice')}> Multiple Choice</Button>
            <Button onClick={() => this.addQuiz('single_choice')}> Single Choice</Button>
            <Button onClick={() => this.addQuiz('match')}>Match</Button>
            <Button onClick={() => this.addQuiz('cloze')}>Cloze</Button>
            <Button onClick={() => this.addQuiz('mix')}>Mix</Button>
            <Button onClick={() => this.addQuiz('cross')}>Cross</Button>
          </div>
          { this.renderSubmitPanel() }
          <div
            style={{ float: 'left', clear: 'both' }}
            ref={(input) => { this.scroller = input; }}
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
QuizCreatorMainPage.propTypes = {
  handleSubmitButton: PropTypes.func.isRequired,
  userToken: PropTypes.shape({}).isRequired,
  handlePublish: PropTypes.func,
};
QuizCreatorMainPage.defaultProps = {
  handlePublish: null,
};
