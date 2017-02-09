import React, { Component } from 'react';
import { Question, Choice, Answer } from './index';
import {Row,Col,Grid} from 'react-bootstrap';
import '../../style/MultipleChoice.css';

class QuestionWrapper extends Component {
  constructor() {
    super();
    this.state = { results: [] }
  }
  onChildChanged(newState, index) {
  const newArray = this.state.results.slice();
  newArray[index] = newState;
  this.setState({ results: newArray })
  this.props.callbackParent(newArray, index);
  }
  renderChoices(index, choice, inReview) {


      return (
        <Choice
          value={index} choiceText={choice.choiceText}
          key={choice.id}
          initialChecked={this.state.checked}
          inReview={inReview}
          callbackParent={(newState) => { this.onChildChanged(newState, index)}}
        />
        );
    }
    renderAnswers(inResultsState, answer, index, myAnswers, answerIndex){
      if(inResultsState) return(<Answer key={answerIndex} myAnswer={this.getMyAnswer(index, myAnswers, answerIndex)} correctAnswer={answer.correct} feedback={answer.choiceFeedback} />);
    //  console.log(answer.correct)
    }
    getMyAnswer(index,myAnswers,answerIndex){
        if (myAnswers[index] && myAnswers[index][answerIndex]){
          return true;
        }
        else return false;
//return false;  && answer.correct===myAnswers[index][answerIndex]
    }

  render() {
  const { objectQuestion, id, index, inReview, inResultsState, correctAnswers, myAnswers} = this.props;
  return (
    <div className="questionWrapper">
      <div className="questionPanel">
        <Question question={objectQuestion.question} index={index} key={id} />
      </div>

      <div style={styles.choiceContainer}>
      <div style={styles.choicePanel}>
        <form>
          { objectQuestion.choice.map((choice, index) => this.renderChoices(index, choice, inReview))}
        </form>
      </div>

      <div style={styles.answersPanel}>
      { correctAnswers.map((answer, answerIndex) => this.renderAnswers(inResultsState, answer, index, myAnswers, answerIndex))}
      </div>
      </div>
    </div>
  );
}
}
const styles = {
  choicePanel: {
    width: 150,
  },
  answersPanel: {

  },
  choiceContainer: {
    padding: 10
  }

};

export { QuestionWrapper };
