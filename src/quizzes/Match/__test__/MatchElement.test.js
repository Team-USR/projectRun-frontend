import React from 'react';
import { shallow, mount } from 'enzyme';
import { MatchRightElement, MatchLeftElement } from '../index';

const questionToBeSent = {
  id: 0,
  type: 'match',
  question: 'title',
  left: [{ id: 'abc', answer: 'left1' }],
  right: [{ id: '123', answer: 'right1' }],
};

const leftObj = questionToBeSent.left[0];

const matchLeftElement = (
  <MatchLeftElement
    id={leftObj.id}
    answer={leftObj.answer}
    key={leftObj.id}
  />
);

const rightObj = {
  id: 0,
  rightElements: questionToBeSent.right,
  leftElements: questionToBeSent.left,
  defaultValue: { id: '', answer: 'default' },
  inReview: false,
  inResult: false,
  onChange: () => true,
  index: 0,
  key: 0,
};

const matchRightElement = (
  <MatchRightElement
    id={0}
    rightElements={questionToBeSent.right}
    leftElements={questionToBeSent.left}
    defaultValue={{ id: '', answer: 'default' }}
    inReview={false}
    inResult={false}
    onChange={() => true}
    index={0}
    key={0}
  />
);

describe('Match Element - set 1 - leftElements', () => {
  const domLeftElement = MatchLeftElement(leftObj);
  /* Test for the function 'renderLeftElement' */
  it('1) Function *MatchLeftElement* should return a LEFT Match Element', () => {
    expect(shallow(domLeftElement).containsMatchingElement([
      matchLeftElement])).toBe(true);
  });

  it('2) Left Element should mount in a full DOM', () => {
    expect(mount(domLeftElement).find('.matchLeftElementWrapper').length).toBe(1);
  });
});

describe('Match Element - set 2 - rightElements', () => {
  const domRightElement = MatchRightElement(rightObj);
  /* Test for the function 'renderLeftElement' */
  it('3) Function *MatchRightElement* should return a RIGHT Match Element', () => {
    expect(shallow(domRightElement).containsMatchingElement([
      matchRightElement])).toBe(true);
  });

  it('4) Right Element should mount in a full DOM', () => {
    expect(mount(domRightElement).find('.matchRightElementWrapper').length).toBe(1);
  });
});
