import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow } from 'enzyme';
import { QuestionWrapper, Question, Choice } from '../index';

describe('<QuestionWrapper />', () => {
  const questionTest = {
    id: 1,
    question: 'test question',
    type: 'single_choice',
    answers: [{
      id: 32,
      answer: 'Answer 1',
    },
    {
      id: 33,
      answer: 'Answer 2',
    }],
  };
  const questionWrapperTag = (<QuestionWrapper
    question={questionTest}
    inResultsState={false}
    inReview={false}
    index={2}
    callbackParent={() => false}
  />);
  const questionWrapperComponent = ReactTestUtils.renderIntoDocument(questionWrapperTag);
  it(' QuestionWrapper should render Choice', () => {
    expect(shallow(questionWrapperTag).find(Choice).length).toBe(2);
  });
  it('should have reviewState props set to false', () => {
    expect(shallow(questionWrapperTag).instance().props.inReview).toBe(false);
  });
  it('should have resultsState props set to false', () => {
    expect(shallow(questionWrapperTag).instance().props.inResultsState).toBe(false);
  });
  it('Question Wrapper should contain question component', () => {
    expect(shallow(questionWrapperTag).find(Question).length).toBe(1);
  });
  const choice = {
    id: 2,
    answer: 'Answer 1',
  };
  it('function renderChoices should return array made from props', () => {
    const functionRenderChoices = questionWrapperComponent.renderChoices(2, choice, false);
    expect(shallow(functionRenderChoices)
    .containsMatchingElement([<Choice
      value={2}
      choiceText="Answer 1"
      id={2}
      key={2}
      inReview={false}
      callbackParent={() => false}
    />])).toBe(true);
  });
});
