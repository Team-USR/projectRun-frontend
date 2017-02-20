import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import { TextInput, ChoiceInput } from './index'
import '../../style/MultipleChoice.css';

class QuizGeneratorWrapper extends Component {
  constructor(){
    super();
    this.state = {answerNoState:0, choices: []};
    this.addAnswers = this.addAnswers.bind(this);
  }
addAnswers(){
    const answersNo = this.state.answerNoState;
    const choicesTemp = this.state.choices;
    choicesTemp.push(1);
    this.setState({answerNoState: answersNo+1,choices:choicesTemp});
  }
renderAnswers(){
    return( <div><ChoiceInput /> </div>);
}
render(){

  return(
    <div className="questionBlock">
    <h1>test</h1>
    <div className="questionWrapper">
   <TextInput text='Question: '/>
   <Button onClick={this.addAnswers}>Add more answers</Button>
   <form>
    {this.state.choices.map((index) => this.renderAnswers())}
    </form>
    </div>
    </div>
  );
}
};





export  {QuizGeneratorWrapper};
