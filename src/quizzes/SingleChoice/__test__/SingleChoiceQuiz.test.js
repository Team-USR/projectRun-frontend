import React from 'react';
import { shallow } from 'enzyme';
import { SingleChoiceQuiz, QuestionWrapper } from '../index';

describe('<SingleChoiceQuiz />', () => {
  const questionTest = {
    id: 1,
    question: 'test question',
    type: 'multiple_choice',
    answers: [{
      id: 32,
      answer: 'Answer 1',
    },
    {
      id: 33,
      answer: 'Answer 2',
    }],
  };
  const multipleChoiceTag = (<SingleChoiceQuiz
    question={questionTest}
    resultsState={false}
    reviewState={false}
    index={2}
    callbackParent={() => false}
  />);
  it(' SingleChoice should render QuestionWrapper', () => {
    expect(shallow(multipleChoiceTag).find(QuestionWrapper).length).toBe(1);
  });

  it('should have correct props', () => {
    expect(shallow(multipleChoiceTag).instance().props.reviewState).toBe(false);
  });
  it('should have correct props', () => {
    expect(shallow(multipleChoiceTag).instance().props.resultsState).toBe(false);
  });
});
