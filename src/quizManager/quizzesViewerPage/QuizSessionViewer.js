import React, { Component } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { API_URL } from '../../constants';
import { BrandSpinner } from '../../components/utils';

export default class QuizSessionViewer extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      error: false,
      sessionsList: [],
      quizInfo: {},
    };
  }
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
      });
    }, 510))
    .catch(() => {
      this.setState({ error: true });
      this.props.handleError('default');
    });
  }
  renderSessionCards() {
    const element = this.state.sessionsList.map((item, index) => {
      if (item.state === 'submitted') {
        return (
          <div style={{ borderWidth: 1, borderColor: '#000000', marginTop: 50 }} key={`session${index + 1}`}>
            <hr />
            <h5>Created at: {item.created_at}</h5>
            <h5>Last updated at: {item.last_updated}</h5>
            <h5>Score: {item.score}</h5>
            <h5>Status: `Submitted`</h5>
            <hr />
          </div>
        );
      }
      if (item.state === 'in_progress') {
        return (
          <div style={{ borderWidth: 1, borderColor: '#000000', marginTop: 50 }} key={`session${index + 1}`}>
            <hr />
            <h5>Created at: {item.created_at}</h5>
            <h5>Last updated at: {item.last_updated}</h5>
            <h5>Status: `In progress`</h5>
            <Button onClick={() => this.props.handleStartButton()}>CONTINUE</Button>
            <hr />
          </div>
        );
      }
      return (null);
    },
  );
    return element;
  }
  render() {
    if (this.state.loading) {
      return <BrandSpinner />;
    }
    return (
      <div>
        <div>
          <h1>{this.state.quizInfo.title}</h1>
          <h5>Created by {this.state.quizInfo.creator_name}</h5>
          <h5>Attempts remaining: {this.state.quizInfo.attempts}</h5>
        </div>
        {this.renderSessionCards()}
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
