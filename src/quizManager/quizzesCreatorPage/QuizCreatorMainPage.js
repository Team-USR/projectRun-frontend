import React, { Component, PropTypes } from 'react';
import { Button, Col } from 'react-bootstrap';
import axios from 'axios';
import Calendar from 'react-input-calendar';
import { MultipleChoiceQuizGenerator } from '../../createQuizzes/MultipleChoice';
import { SingleChoiceQuizGenerator } from '../../createQuizzes/SingleChoice';
import { MatchQuizGenerator } from '../../createQuizzes/Match';
import { MixQuizGenerator } from '../../createQuizzes/Mix';
import { ClozeGenerator } from '../../createQuizzes/Cloze';
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
    };
    this.isReviewMode = this.isReviewMode.bind(this);
    this.isResultsMode = this.isResultsMode.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.changeAttempts = this.changeAttempts.bind(this);
    this.changeReleaseDate = this.changeReleaseDate.bind(this);
    this.setNegativeMarking = this.setNegativeMarking.bind(this);
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
  checkMultiple(element) {
    this.element = element;
    let errorMessage = '';
    let atLeastOneTrue = false;
    let answerFields = '';
    if (element.question === '') {
      errorMessage += 'Question is empty. \n';
    }
    element.answers_attributes.map((item) => {
      if (item.is_correct === true) {
        atLeastOneTrue = true;
      }
      if (item.answer === '' || item.answer === undefined) {
        answerFields = 'Answer fields can\'t be empty. \n';
      }
      return 0;
    });
    if (atLeastOneTrue === false) {
      errorMessage += 'At least one of the answers needs to be true. \n';
    }
    errorMessage += answerFields;
    return errorMessage;
  }

  checkMix(element) {
    this.element = element;
    const solArray = element.sentences_attributes;
    let mainSol = '';
    const altSol = [];
    for (let i = 0; i < solArray.length; i += 1) {
      if (solArray[i].is_main === true) {
        mainSol = solArray[i].text;
      } else {
        altSol.push(solArray[i].text);
      }
    }
    const splitMain = mainSol.split(' ').sort().join(',');
    let everythingMatches = true;
    altSol.map((el) => {
      const splitAlt = el.split(' ').sort().join(',');
      if (splitMain !== splitAlt) {
        everythingMatches = false;
      }
      return '';
    });
    if (!everythingMatches) {
      return ('The alternate solutions should contain all the main solution characters!');
    }
    return '';
  }

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
    } else if (element.type === 'multiple_choice') {
      errorMessage = this.checkMultiple(element);
    } else if (element.type === 'single_choice') {
        // TODO: check for errors
        //  errorMessage = this.checkSingle(element); --returns string describing error
    } else if (element.type === 'mix') {
      errorMessage = this.checkMix(element);
    } else if (element.type === 'cloze') {
        // TODO: check for errors
        //  errorMessage = this.checkCloze(element); --returns string describing error
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
      window.alert('Quiz has errors');
    }
  }
  isResultsMode() {
    const newState = !this.state.resultsState;
    this.setState({ resultsState: newState });
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
    //  console.log('QUIZ POST', quiz);
    inputQ.quiz.questions_attributes[questionID] = quiz;
    this.checkCorectness(inputQ.quiz.questions_attributes[questionID], questionID);
    this.setState({ submitedQuestions: inputQ });
  }

  collectClozeObject(questionID, sentenceAttributes, gapsAttributes) {
    const inputQ = this.state.submitedQuestions;
    let pointsAssigned = 0;
    if (inputQ.quiz.questions_attributes[questionID] &&
       inputQ.quiz.questions_attributes[questionID].points) {
      pointsAssigned = inputQ.quiz.questions_attributes[questionID].points;
    }
    // if (inputQ.quiz.questions_attributes[questionID] === undefined) {
    //   pointsAssigned = this.state.quizInfo.questions[questionID].points;
    // }
    const newQuestion = {
      question: 'Fill in the gaps:',
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
          <div style={{ textAlign: 'center' }}>
            <label htmlFor="pointIn" style={{ marginRight: 10 }}>
              <h5>Score:</h5>
            </label>
            <input
              id="pointIn"
              placeholder="ex: 10"
              type="number"
              onChange={event => this.setPoints(event, index)}
            />
          </div>
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
                    placeholder="ex: 10"
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
          { this.renderSubmitPanel() }
          Select a quiz to be added:
          <br />
          <div className="quizButtons">
            <Button onClick={() => this.addQuiz('multiple_choice')}> Multiple Choice</Button>
            <Button onClick={() => this.addQuiz('single_choice')}> Single Choice</Button>
            <Button onClick={() => this.addQuiz('match')}>Match</Button>
            <Button onClick={() => this.addQuiz('cloze')}>Cloze</Button>
            <Button onClick={() => this.addQuiz('mix')}>Mix</Button>
          </div>
          <div
            style={{ float: 'left', clear: 'both' }}
            ref={(input) => { this.scroller = input; }}
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
