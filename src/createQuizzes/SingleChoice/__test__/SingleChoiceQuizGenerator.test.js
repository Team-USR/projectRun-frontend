import React from 'react';
import { shallow } from 'enzyme';
import { SingleChoiceQuizGenerator } from '../index';

describe('<SingleChoiceQuizGenerator />', () => {
  const SingleChoiceQuizGeneratorTag = (<SingleChoiceQuizGenerator
    handleInput={() => true}
    content={null}
    index={2}
    key={'multiple_choice2'}
    updateParent={() => true}
  />);
  it(' SingleChoiceQuizGenerator should render a question input', () => {
    expect(shallow(SingleChoiceQuizGeneratorTag).find('.questionInput').length).toBe(1);
  });
  it(' SingleChoiceQuizGenerator should render the question block', () => {
    expect(shallow(SingleChoiceQuizGeneratorTag).find('.questionBlock').length).toBe(1);
  });
  it(' SingleChoiceQuizGenerator should render the question block', () => {
    expect(shallow(SingleChoiceQuizGeneratorTag).find('.form-control').length).toBe(1);
  });
});
