import React, { Component } from 'react';
import axios from 'axios';
// import { QuizViewerMainPage } from './quizManager/quizzesViewerPage';
//  import { QuizCreatorMainPage } from './quizManager/quizzesCreatorPage';
import { Button } from 'react-bootstrap';
import { MultipleChoiceQuiz } from './quizzes/MultipleChoice';
import { MatchQuiz } from './quizzes/Match';
import { logoutUser } from './redux/modules/user';
import './App.css';
import './style/Main.css';

// export default function App() {
//   return (
//     <QuizViewerMainPage />
//   );
// }


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

class App extends Component {
  constructor() {
    super();
    this.state = { loadingQuiz: true, quizInfo: [] };
  }
  componentWillMount() {
    const quizId = 4;
    axios.get(`https://project-run.herokuapp.com/quizzes/${quizId}`)
    .then(response => this.setState({ quizInfo: response.data, loadingQuiz: false }));
  }
  renderQuestions(question, index) {
    if (question.type === 'multiple_choice') {
      return (
        <MultipleChoiceQuiz
          question={question}
          index={index}
          key={question.id}
        />
      );
    }
    if (question.type === 'match') {
      return (
        <MatchQuiz />
      );
    }
    return this.state.loadingQuiz;
  }
  render() {
    if (this.state.loadingQuiz) {
      return (<div className="questionBlock" style={styles.loading}>
        <h1>Loading...</h1>
      </div>);
    }
    return (
      <div className="questionBlock">
        <Button onClick={logoutUser}>Logout</Button>
        <h1 style={styles.quizTitle}>{this.state.quizInfo.title}</h1>
        {this.state.quizInfo.questions.map((question, index) =>
            this.renderQuestions(question, index))}
      </div>
    );
  //  return (<QuizGeneratorWrapper />);
  }
}

export default App;

