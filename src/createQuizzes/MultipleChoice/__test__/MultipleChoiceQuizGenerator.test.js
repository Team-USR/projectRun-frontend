import React from 'react';
import { shallow } from 'enzyme';
import { MultipleChoiceQuizGenerator } from '../index';

describe('<MultipleChoiceQuizGenerator />', () => {
  const MultipleChoiceGeneratorTag = (<MultipleChoiceQuizGenerator
    handleInput={() => true}
    content={null}
    index={2}
    key={'multiple_choice2'}
    updateParent={() => true}
  />);
  it(' MultipleChoiceGenerator should render a question input', () => {
    expect(shallow(MultipleChoiceGeneratorTag).find('.questionInput').length).toBe(1);
  });
  it(' MultipleChoiceGenerator should render the question block', () => {
    expect(shallow(MultipleChoiceGeneratorTag).find('.questionBlock').length).toBe(1);
  });
  it(' MultipleChoiceGenerator should render the question block', () => {
    expect(shallow(MultipleChoiceGeneratorTag).find('.form-control').length).toBe(1);
  });
});
