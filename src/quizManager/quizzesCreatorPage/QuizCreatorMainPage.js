import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { MultipleChoiceQuizGenerator } from '../../createQuizzes/MultipleChoice';
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
      submitedQuestions: { quiz: { title: '', questions_attributes: [], release_date: '2017-03-15' } },
      generatedQuizID: 0,
      answers: { quiz: [] },
      reviewState: false,
      resultsState: false,
      loading: false,
      errorState: false,
    };
    this.isReviewMode = this.isReviewMode.bind(this);
    this.isResultsMode = this.isResultsMode.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.changeAttempts = this.changeAttempts.bind(this);
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
    } else if (type === 'multiple_choice') {
      quiz = { question, type, answers_attributes: answersAttributes };
    }
    //  console.log('QUIZ POST', quiz);
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
        <div className="generatorQuizContainer" key={`generatorQuizContainer${displayIndex}`}>
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
          <Button className="submitButton" onClick={this.isReviewMode}>Save</Button>
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
  //  console.log(this.state.submitedQuestions);
  //  console.log(this.state.questions);
  //  console.log("end rendering");
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
          Title:
           <input
             id="titleInput" type="text" placeholder="title" onChange={this.changeTitle}
           />
            <input
              id="attemptsInput"
              type="number"
              placeholder="Number of attempts"
              onChange={this.changeAttempts}
            />
          </label>
          <br /><br />
         Select a quiz to be added:
         <br />
          <Button onClick={() => this.addQuiz('multiple_choice')}> Multiple Choice</Button>
          <Button onClick={() => this.addQuiz('match')}>Match</Button>
          <Button onClick={() => this.addQuiz('cloze')}>Cloze</Button>
          <Button onClick={() => this.addQuiz('mix')}>Mix</Button>
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
QuizCreatorMainPage.propTypes = {
  handleSubmitButton: PropTypes.func.isRequired,
  userToken: PropTypes.shape({}).isRequired,
  handlePublish: PropTypes.func,
};
QuizCreatorMainPage.defaultProps = {
  handlePublish: null,
};
