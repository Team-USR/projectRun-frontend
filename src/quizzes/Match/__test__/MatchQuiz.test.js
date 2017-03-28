import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow, mount } from 'enzyme';
import { MatchQuiz, MatchRightElement, MatchLeftElement } from '../index';

const questionToBeSent = {
  id: 0,
  type: 'match',
  question: 'title',
  match_default: 'Choose an option',
  left: [{ id: 'abc', answer: 'left1' }],
  right: [{ id: '123', answer: 'right1' }],
  points: 2,
};

const matchQuiz = (
  <MatchQuiz
    id={questionToBeSent.id}
    reviewState={false}
    resultsState={false}
    question={questionToBeSent}
    index={0}
    correctAnswer={{}}
    callbackParent={() => true}
    key={questionToBeSent.id}
  />
);

const leftObj = questionToBeSent.left[0];

const matchLeftElement = (
  <MatchLeftElement
    id={leftObj.id}
    answer={leftObj.answer}
    key={leftObj.id}
  />
);

const rightObj = questionToBeSent.right[0];

const matchRightElement = (
  <MatchRightElement
    id={0}
    rightElements={questionToBeSent.right}
    leftElements={questionToBeSent.left}
    defaultValue={{ id: '', answer: 'default' }}
    defaultAnswer={{ id: '', answer: 'option 1' }}
    inReview={false}
    inResult={false}
    onChange={() => true}
    index={0}
    key={0}
  />
);

const matchQuizComponent = ReactTestUtils.renderIntoDocument(matchQuiz);

describe('Match Quiz - set 1 - leftElements', () => {
  const renderLeftElement = matchQuizComponent.renderLeftElement(leftObj);
  /* Test for the function 'renderLeftElement' */
  it('1) Function *renderLeftElement* should return a LEFT Match Element', () => {
    expect(shallow(renderLeftElement).containsMatchingElement([
      matchLeftElement])).toBe(true);
  });

  /* The component should render Left Match elements */
  it('2) Should render a LEFT Match Element', () => {
    expect(shallow(matchQuiz).containsMatchingElement([
      matchLeftElement])).toBe(true);
  });
});

describe('Match Quiz - set 2 - rightElements', () => {
  const renderRightElement = matchQuizComponent.renderRightElement(rightObj, 0);
  /* Test for the function 'renderRightElement' */
  it('3) Function *renderRightElement* should return a RIGHT Match Element', () => {
    expect(shallow(renderRightElement).containsMatchingElement([
      matchLeftElement])).toBe(true);
  });

  /* The component should render Right Match elements */
  it('4) Should render a RIGHT Match Element', () => {
    expect(shallow(matchQuiz).containsMatchingElement([
      matchRightElement])).toBe(true);
  });
});

describe('Match Quiz - set 3 - DOM Elements', () => {
  /* Test for Single Div with class .matchQuizContainer */
  it('5) MatchQuiz should mount in a full DOM', () => {
    expect(mount(matchQuiz).find('.cardSection').length).toBe(1);
  });

  it('6) Check if MatchQuiz has a title', () => {
    expect(mount(matchQuiz).find('.matchQuizTitle').length).toBe(1);
  });
});
