import React, { Component } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { API_URL } from '../../constants';
import { BrandSpinner } from '../../components/utils';

/*
 Component that contains list of all sessions being renderd
*/
export default class QuizSessionViewer extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      error: false,
      sessionsList: [],
      quizInfo: {},
      displayedAttempts: null,
    };
  }
  /*
   Component will mount method will make a request to the backend to retrieve a list of sessions
   for a quiz id that is being passed through props.
  */
  componentWillMount() {
    axios({
      url: `${API_URL}/quizzes/${this.props.quizID}/start`,
      headers: this.props.userToken,
    })
    .then(response => setTimeout(() => {
      this.setState({
        loading: false,
        sessionsList: response.data.sessions,
        quizInfo: response.data.quiz,
        displayedAttempts: (response.data.quiz.attempts - response.data.sessions.length),
      });
    }, 510))
    .catch(() => {
      this.setState({ error: true });
      this.props.handleError('default');
    });
  }
  /*
    In case there the component needs to change the session list that is rendered,
    it will receive a new props and make a new request in order to get the new content
    @param nextProps
  */
  componentWillReceiveProps(nextProps) {
    if (nextProps.quizID !== this.props.quizID) {
      this.setState({ loading: true });
      axios({
        url: `${API_URL}/quizzes/${nextProps.quizID}/start`,
        headers: nextProps.userToken,
      })
      .then(response => setTimeout(() => {
        this.setState({
          loading: false,
          sessionsList: response.data.sessions,
          quizInfo: response.data.quiz,
          displayedAttempts: (response.data.quiz.attempts - response.data.sessions.length),
        });
      }, 510))
      .catch(() => {
        this.setState({ error: true });
        this.props.handleError('default');
      });
    }
  }
  /*
    Method that renders each session item from the list and wrap it into
    a session card.
  */
  renderSessionCards() {
    const element = [];
    let inprogress = 0;
    if (this.state.sessionsList.length > 0) {
      this.state.sessionsList.map((item, index) => {
        if (item.state === 'submitted') {
          element.push(
            <div className="sessionCard" key={`session${index + 1}`}>
              <div className="row">
                <div className="col-md-9">
                  <h5>{item.created_at}</h5>
                  <h5>{item.last_updated}</h5>
                </div>
                <div className="col-md-3 rightSection">
                  <h5>Submitted</h5>
                  <h5>Score: {item.score}</h5>
                </div>
              </div>
            </div>,
        );
        }
        return (null);
      },
    this.state.sessionsList.map((item, index) => {
      if (item.state === 'in_progress') {
        inprogress += 1;
        element.push(
          <div className="inProgress" key={`session${index + 1}`}>
            <div className="row">
              <div className="col-md-9">
                <h5>{item.created_at}</h5>
                <h5>{item.last_updated}</h5>
              </div>
              <div className="col-md-3 rightSection">
                <h5>In progress</h5>
                <Button
                  id="continueQuizButton"
                  className=""
                  onClick={() => this.props.handleStartButton()}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>,
              );
      }
      return (null);
    },

  ),
  );
    }
    if ((inprogress === 0 ||
       this.state.sessionList === undefined) &&
       (this.state.displayedAttempts !== 0 || this.state.quizInfo.attempts === 0)) {
      element.push(
        <div className="inProgress" key={`startSession${1}`}>
          <div className="row">
            <div className="col-md-9">
              <h5>New session</h5>
              <h5>{}</h5>
            </div>
            <div className="col-md-3 rightSection">
              <Button
                id="startQuizButton"
                onClick={() => this.props.handleStartButton()}
              >
                Start
              </Button>
            </div>
          </div>
        </div>,
        );
    }
    return element.reverse();
  }
  /*
  Render method that displays all the data on the screen.
  */
  render() {
    if (this.state.loading) {
      return <BrandSpinner />;
    }
    let attemptsRemaining = this.state.quizInfo.attempts;
    if (attemptsRemaining > 0) {
      attemptsRemaining = `Attempts remaining:   ${this.state.displayedAttempts}`;
      if (this.state.displayedAttempts === 0) {
        attemptsRemaining = 'No more attempts remaining';
      }
    }
    if (attemptsRemaining === 0) {
      attemptsRemaining = 'You have unlimited attempts for this quiz';
    }
    return (
      <div>
        <div className="mainQuizSessionBlock">
          <div className="mainHeading">
            <h1>{this.state.quizInfo.title}</h1>
            <h5>Created by {this.state.quizInfo.creator_name}</h5>
            <h5>{attemptsRemaining}</h5>
          </div>
          <div className="sessionWrapper">
            {this.renderSessionCards()}
          </div>
        </div>

      </div>
    );
  }
}
QuizSessionViewer.propTypes = {
  userToken: React.PropTypes.shape({}).isRequired,
  quizID: React.PropTypes.string.isRequired,
  handleError: React.PropTypes.func,
  handleStartButton: React.PropTypes.func,
};
QuizSessionViewer.defaultProps = {
  handleError: null,
  handleStartButton: null,
};
