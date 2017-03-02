import React from 'react';
import { shallow } from 'enzyme';
import { QuizViewerMainPage } from '../';
import { MultipleChoiceQuiz } from '../../../quizzes/MultipleChoice';

describe('<QuizViwerMainPage />', () => {
  it('Component should contain loading screen', () => {
    expect(shallow(<QuizViewerMainPage />)
    .containsMatchingElement([<h1>Loading...</h1>])).toEqual(true);
  });
  // const quizViewerTag = (<QuizViewerMainPage />);
  // const quizViewer = ReactTestUtils.renderIntoDocument(quizViwerTag);
  // it('QuizViewer should render MultipleChoice', () => {
  //   expect(shallow(quizViewerTag).find(MultipleChoiceQuiz).length).toBe(1);
  // });
});
