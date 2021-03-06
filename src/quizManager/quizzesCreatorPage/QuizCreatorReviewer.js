import React, { Component } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { MultipleChoiceQuiz } from '../../quizzes/MultipleChoice';
import { SingleChoiceQuiz } from '../../quizzes/SingleChoice';
import { ClozeQuestion } from '../../quizzes/Cloze';
import { MatchQuiz } from '../../quizzes/Match/';
import { MixQuiz } from '../../quizzes/Mix/';
import { CrossQuiz } from '../../quizzes/Cross/';
import { API_URL } from '../../constants';
import { BrandSpinner } from '../../components/utils';
import { getNOfGaps } from '../../helpers/Cloze';


const styles = {
  quizTitle: {
    color: '#000',
    textAlign: 'center',
  },
  loading: {
    textAlign: 'center',
    marginTop: 100,
  },
};
/*
  Component which wrapps a quizz and all it's questions while being into the review mode.
  This state is obtained after a user creates a quizz. In this component the user is able to see
  a generated quiz with a specific id and is able to choose to edit it
*/
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
  /*
    Makes the request to the backend when the component is mounted on the screen,
    Retrieves the data to be further displayed on the screen.
  */
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
  /*
   When the quiz id is changed the method receives new props and makes a new request in order
   to update the data on the screen.
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
  /*
   Makes a post request that publishes a quiz in order to be available to the students.
  */
  publishQuiz() {
    this.setState({ loadingPublishing: true });
    axios({
      url: `${API_URL}/quizzes/${this.props.quizID}/publish`,
      headers: this.props.userToken,
      method: 'post',
    })
    .then((response) => {
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
  /*
    Renders a certain type of question on the screen being given the index and the
    question object
    @param question [actual question object containing the information to be displayed]
    @param index [index of the question to be displayed]
  */
  renderQuestions(question, index) {
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
    if (question.type === 'single_choice') {
      return (
        <SingleChoiceQuiz
          id={question.id}
          reviewState={this.state.reviewState}
          resultsState={this.state.resultsState}
          question={question}
          index={index}
          correctAnswer={{}}
          creatorAnswers={answersAttributes}
          callbackParent={() => {}}
          key={`single_choice_quiz_${question.id}`}
        />
      );
    }
    if (question.type === 'match') {
      const newQuestion = question;
      const pairs = newQuestion.pairs;
      newQuestion.left = pairs.map((obj) => {
        const leftItem = { id: obj.id.toString(), answer: obj.left_choice };
        return leftItem;
      });
      newQuestion.right = pairs.map((obj) => {
        const rightItem = { id: obj.id.toString(), answer: obj.right_choice };
        return rightItem;
      });

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
          teacherView={this.state.reviewState}
          resultsState={this.state.resultsState}
          callbackParent={() => {}}
        />
      );
    }
    if (question.type === 'cloze') {
      const sentencesInExercise = question.cloze_sentence.text.split('\n');
      const reversedGaps = question.gaps.map(gap => ({
        gap: gap.gap_text,
        hint: gap.hint ? gap.hint.hint_text : '',
      }));
      const questionsArray = sentencesInExercise.map(sentence => ({
        text: sentence,
        gaps: reversedGaps.splice(0, getNOfGaps(sentence)),
      }));

      return (
        <ClozeQuestion
          key={question.id}
          index={index}
          points={question.points}
          request={question.question}
          sentences={questionsArray}
        />
      );
    }

    if (question.type === 'cross') {
      return (
        <CrossQuiz
          id={question.id}
          index={index}
          question={question}
          reviewState={this.state.reviewState}
          resultsState={this.state.resultsState}
          correctAnswer={{}}
          callbackParent={() => {}}
          key={`cross_quiz_${question.id}`}
        />
      );
    }
    return ('');
  }
  /*
    Render method that show all the components on the screen
  */
  render() {
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
          <h1>{this.state.quizInfo.title}</h1>
          {(this.state.quizInfo.attempts !== 0 &&
            (<h5>Attempts remaining: {this.state.quizInfo.attempts}</h5>))
            || <h5>This quiz has an unlimited number of attempts</h5> }
          <h5>Release date: {this.state.quizInfo.release_date}</h5>
          <h5 className="negativeMarking">Negative marking: </h5>
          <input
            className="negativeMarkingCheckBox"
            type="checkbox"
            disabled
            checked={this.state.quizInfo.negative_marking}
          />
          {this.state.quizInfo.questions.map((question, index) =>
          this.renderQuestions(question, index))}
          <div className="submitPanel">
            <Button
              className="enjoy-css"
              onClick={() => this.props.handleSubmitButton()}
            >
              Edit
            </Button>
            <Button
              className="enjoy-css"
              onClick={() => this.publishQuiz()}
            >
              Publish
            </Button>
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
              className="enjoy-css"
              onClick={() => this.props.deleteQuiz(this.state.quizInfo.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      );
    }
    return (
      <div className="mainQuizViewerBlock">
        <h1>{this.state.quizInfo.title}</h1>
        {this.state.quizInfo.questions.map((question, index) =>
        this.renderQuestions(question, index))}
        <div className="submitPanel">
          <Button
            className="enjoy-css"
            onClick={() => this.props.handleSubmitButton()}
          >
            Edit
          </Button>
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
