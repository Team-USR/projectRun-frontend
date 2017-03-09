import React from 'react';
import { shallow } from 'enzyme';
import { QuizViewerMainPage } from '../';

describe('<QuizViwerMainPage />', () => {
  it('Component should contain loading screen', () => {
    expect(shallow(<QuizViewerMainPage userToken={{}} />)
    .containsMatchingElement([<h1>Loading...</h1>])).toEqual(true);
  });
  // const quizViewerTag = (<QuizViewerMainPage />);
  // const quizViewer = ReactTestUtils.renderIntoDocument(quizViwerTag);
  // it('QuizViewer should render MultipleChoice', () => {
  //   expect(shallow(quizViewerTag).find(MultipleChoiceQuiz).length).toBe(1);
  // });
});
