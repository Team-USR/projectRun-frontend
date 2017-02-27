import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow, mount, render } from 'enzyme';
import { QuizViewerMainPage } from '../index';
import { MultipleChoiceQuiz } from '../../../quizzes/MultipleChoice/index';

describe('<QuizViwerMainPage />', ()=> {
  it('Component should contain loading screen', () => {
    expect(shallow(<QuizViewerMainPage />).containsMatchingElement([<h1>Loading...</h1>])).toEqual(true);
  });
  //
  // const quizViewerTag = (<QuizViewerMainPage />);
  // const quizViewer = ReactTestUtils.renderIntoDocument(quizViwerTag);
  // it('QuizViewer should render MultipleChoice', () => {
  //   expect(shallow(quizViewerTag).find(MultipleChoiceQuiz).length).toBe(1);
  // });
});
