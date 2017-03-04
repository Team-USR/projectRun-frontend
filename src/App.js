import React from 'react';
import { NavBarContainer } from './containers';
import { ClozeQuestion } from './quizzes/Cloze';
import { ClozeGenerator } from './createQuizzes/Cloze';
import './App.css';

export default function App(props) {
  const questions = [{
    no: 1,
    question: 'Pls work {1}.',
    hint: 'test',
  }, {
    no: 2,
    question: 'This {1} and {2} before.',
  }];
  return (
    <div className="appWrapper">
      <NavBarContainer />
      {props.children}
      <ClozeQuestion index={1} req="Fill in the gaps:" questions={questions} />
      <ClozeGenerator />
    </div>
  );
}

App.propTypes = {
  children: React.PropTypes.element.isRequired,
};
