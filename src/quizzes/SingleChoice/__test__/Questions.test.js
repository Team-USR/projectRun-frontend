import React from 'react';
import { shallow } from 'enzyme';
import { Question } from '../index';

describe('<Choice />', () => {
  const QuestionTag = (<Question
    index={2}
    question={'Test question'}
    key={2}
    callbackParent={() => false}
  />);
  it(' Question  should render <h3> tag', () => {
    expect(shallow(QuestionTag).containsMatchingElement([<h3>Test question</h3>])).toEqual(true);
  });
});
