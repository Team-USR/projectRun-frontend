import React from 'react';
import { shallow } from 'enzyme';
import { AlternateSolution, MixQuizGenerator } from '../index';

describe('<MixQuizGenerator />', () => {
  const obj = {
    question: 'MixTest',
    sentences: [
      { text: 'main solution is here', is_main: true },
      { text: 'alternate solution 1', is_main: false },
      { text: 'alternate solution 2', is_main: false },
    ],
  };
  const tag = (<MixQuizGenerator
    index={1}
    updateParent={() => true}
    content={obj}
  />);
  it('should contain 2 alternate solution wrappers', () => {
    expect(shallow(tag).find(AlternateSolution).length).toBe(2);
  });
  it('should render the title received from a prop object', () => {
    expect(shallow(tag).containsMatchingElement(<input value="MixTest" />)).toEqual(true);
  });
});
