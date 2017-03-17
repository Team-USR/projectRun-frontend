import React, { Component } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { MultipleChoiceQuiz } from '../../quizzes/MultipleChoice';
import { ClozeQuestion } from '../../quizzes/Cloze';
import { MatchQuiz } from '../../quizzes/Match/';
import { MixQuiz } from '../../quizzes/Mix/';
import { API_URL } from '../../constants';
import { BrandSpinner } from '../../components/utils';
import getNOfGaps from '../../helpers/Cloze';


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
      error: false,
      published: false,
      loadingPublishing: false,
    };
    this.isReviewMode = this.isReviewMode.bind(this);
  }
  componentWillMount() {
    axios({
      url: `${API_URL}/quizzes/${this.props.quizID}/edit`,
      headers: this.props.userToken,
    })
    .then((response) => {
      if (!response || (response && response.status !== 200)) {
        this.setState({ errorState: true });
      }
      setTimeout(() => {
        this.setState({
          loadingQuiz: false,
        });
      }, 510);
      this.setState({
        quizInfo: response.data, published: response.data.published });
    })
    .catch(() => {
      this.setState({ error: true });
      this.props.handleError('default');
    });
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.quizID !== nextProps.quizID) {
      this.setState({ loadingQuiz: true });
//    console.log("SDADS", nextProps.quizID);
      axios({
        url: `${API_URL}/quizzes/${nextProps.quizID}/edit`,
        headers: this.props.userToken,
      })
      .then((response) => {
  //    console.log(response);
        if (!response || (response && response.status !== 200)) {
          this.setState({ errorState: true });
        }
        this.setState({
          quizInfo: response.data, published: response.data.published });
        setTimeout(() => {
          this.setState({
            loadingQuiz: false,
          });
        }, 510);
      });
    }
  }
  publishQuiz() {
    this.setState({ loadingPublishing: true });
    axios({
      url: `${API_URL}/quizzes/${this.props.quizID}/publish`,
      headers: this.props.userToken,
      method: 'post',
    })
    .then((response) => {
//      console.log(response);
      if (!response || (response && response.status !== 200)) {
        this.setState({ errorState: true });
      }
      setTimeout(() => {
        this.setState({
          loadingPublishing: false,
        });
      }, 510);
      this.props.handlePublish();
      this.setState({ published: true });
    });
  }
  isReviewMode() {
    const newState = !this.state.reviewState;
    this.setState({ reviewState: newState });
  }
  renderQuestions(question, index) {
  //  console.log(answers);
  //  console.log(type);
//    console.log("ANSWERSATTRIBUTES", question.answers);
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
      const newQuestion = question;
      const pairs1 = newQuestion.pairs;
      const pairs2 = newQuestion.pairs;
      // console.log(newQuestion.pairs);
      const Xleft = pairs1.map((obj) => {
        // console.log(obj);
        const x = { id: obj.id.toString(), answer: obj.left_choice };
        return x;
      });
      const Xright = pairs2.map((obj) => {
        // console.log(obj);
        const x2 = { id: obj.id.toString(), answer: obj.right_choice };
        return x2;
      });

      newQuestion.left = Xleft;
      newQuestion.right = Xright;

      // console.log(Xleft, Xright);

      // console.log(newQuestion);
      // console.log(question.pairs);
      return (
        <MatchQuiz
          id={question.id}
          reviewState={this.state.reviewState}
          resultsState={this.state.resultsState}
          question={newQuestion}
          index={index}
          correctAnswer={{}}
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
    if (question.type === 'cloze') {
      const sentencesInExercise = question.cloze_sentence.text.split('\n');
      const reversedGaps = question.gaps.slice().reverse();
      const questionsArray = sentencesInExercise.map((sentence, ind) => ({
        no: ind + 1,
        question: sentence,
        gaps: reversedGaps.splice(0, getNOfGaps(sentence)),
      }));

      return (
        <ClozeQuestion
          req={question.question}
          index={index}
          questions={questionsArray}
          key={question.id}
          reviewState={this.state.reviewState}
          resultsState={this.state.resultsState}
        />
      );
    }
    return ('');
  }
  render() {
  //  console.log(this.state.quizInfo);
  //    console.log("RENDER QUIZ "+ this.props.quizID, this.state.quizInfo.title);
    if (this.state.error === true) {
      return (<div className="mainQuizViewerBlock" style={styles.loading}>
        <h1>Error</h1>
      </div>);
    } else
    if (this.state.loadingQuiz) {
      return (<BrandSpinner />);
    } else
    if (this.state.loadingPublishing) {
      return <BrandSpinner />;
    }
    if (!this.state.published) {
      return (
        <div className="mainQuizViewerBlock">
          <h1 style={styles.quizTitle}>{this.state.quizInfo.title}</h1>
          <h5 style={styles.quizTitle}>Attempts remaining: {this.state.quizInfo.attempts}</h5>
          {this.state.quizInfo.questions.map((question, index) =>
          this.renderQuestions(question, index))}
          <div className="submitPanel">
            <Button
              className="submitButton"
              onClick={() => this.props.handleSubmitButton()}
            >EDIT QUIZ</Button>
            <Button
              className="submitButton"
              onClick={() => this.publishQuiz()}
            >Publish quiz</Button>
          </div>
        </div>
      );
    } else
    if (this.state.published) {
      return (
        <div className="mainQuizViewerBlock">
          <h1 style={styles.quizTitle}>{this.state.quizInfo.title}</h1>
          {this.state.quizInfo.questions.map((question, index) =>
          this.renderQuestions(question, index))}
          <div className="submitPanel">
            <Button
              className="submitButton"
              onClick={() => this.props.deleteQuiz(this.state.quizInfo.id)}
            >DELETE QUIZ</Button>
          </div>
        </div>
      );
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
  handlePublish: React.PropTypes.func,
  quizID: React.PropTypes.string.isRequired,
  deleteQuiz: React.PropTypes.func,
  handleError: React.PropTypes.func,
};
QuizCreatorReviewer.defaultProps = {
  handlePublish: null,
  deleteQuiz: null,
  handleError: null,
};
