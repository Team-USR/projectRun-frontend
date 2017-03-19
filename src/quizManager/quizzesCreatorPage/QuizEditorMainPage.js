import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { MultipleChoiceQuizGenerator } from '../../createQuizzes/MultipleChoice';
import { MatchQuizGenerator } from '../../createQuizzes/Match';
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
    };
    this.isReviewMode = this.isReviewMode.bind(this);
    this.isResultsMode = this.isResultsMode.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.changeAttempts = this.changeAttempts.bind(this);
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
       const generatedQuiz = this.state.submitedQuestions;
       generatedQuiz.quiz.title = response.data.title;
       generatedQuiz.quiz.attempts = response.data.attempts;
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
    } else if (type === 'multiple_choice') {
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

    inputQuestionList.push(inputQuestion);
    questionList.push(questionObject);

    // console.log(questionList);
    this.setState({ questions: questionList, inputQuestions: inputQuestionList });
    id += 1;
  }
  changeTitle(event) {
    const generatedQuiz = this.state.submitedQuestions;
    generatedQuiz.quiz.title = event.target.value;
    this.setState({ submitedQuestions: generatedQuiz });
  }
  changeAttempts(event) {
    const attempted = this.state.submitedQuestions;
    attempted.quiz.attempts = event.target.value;
    this.setState({ submitedQuestions: attempted });
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
          <h1> Quiz Editor </h1>
          <label htmlFor="titleInput">
          Title:
           <input
             id="titleInput"
             type="text"
             placeholder="title"
             onChange={this.changeTitle}
             value={submit.quiz.title}
           />
            <input
              id="attemptsInput"
              type="number"
              placeholder="attempts"
              onChange={this.changeAttempts}
              value={submit.quiz.attempts}
            />
          </label>
          <br /><br />
         Select a quiz to be added:
         <br />
          <Button onClick={() => this.addQuiz('multiple_choice', null)}> Multiple Choice</Button>
          <Button onClick={() => this.addQuiz('match', null)}>Match</Button>
          <Button onClick={() => this.addQuiz('cloze', null)}>Cloze</Button>
          {this.renderQuestions()}
          <br /><br /><br />
          { this.renderSubmitPanel() }
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
