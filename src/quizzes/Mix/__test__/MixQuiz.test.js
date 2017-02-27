import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow } from 'enzyme';
import { WordButton, MixQuiz } from '../index';

describe('<MixQuiz />', () => {
  const questionToBeSent = {
    id: 1,
    question: 'who dis',
    type: 'mix_quiz',
    words: ['just',
      '3',
      'words'],
  };
  const tag = (<MixQuiz
    question={questionToBeSent}
    resultsState={false}
    reviewState={false}
    index={2}
  />);
  const mixQuizComponent = ReactTestUtils.renderIntoDocument(tag);
  it('should render 3 WordButtons', () => {
    expect(shallow(tag).find(WordButton).length).toBe(3);
  });

  it('should contain the appropriate label title', () => {
    expect(shallow(tag).containsMatchingElement(
      [<h3>2. Question text to be tested</h3>])).toEqual(true);
  });

  it('should return a div container', () => {
    expect(shallow(tag).type()).toEqual('div');
  });

  it('should have correct props', () => {
    expect(shallow(tag).instance().props.reviewState).toBe(false);
  });

  it('function should return array made from props', () => {
    const functionToTest = mixQuizComponent.renderButtons([0, 1])[0];
    expect(shallow(functionToTest)
    .containsMatchingElement([<WordButton
      text="just"
      reviewState={false}
      resultsState={false}
      onClick={() => true}
    />])).toBe(true);
  });
});
