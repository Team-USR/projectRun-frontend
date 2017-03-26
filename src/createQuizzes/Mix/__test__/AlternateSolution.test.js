import React from 'react';
import { shallow } from 'enzyme';
import { AlternateSolution } from '../index';

describe('<AlternateSolution />', () => {
  const tag = (<AlternateSolution
    index={1}
    value={'test'}
    handleInputChange={() => true}
    removeSolution={() => true}
  />);
  it('should render the correct index: 2', () => {
    expect(shallow(tag).containsMatchingElement(
      [<div>2</div>])).toEqual(true);
  });
  it('should render the correct input text', () => {
    expect(shallow(tag).containsMatchingElement(
      [<input value="test" />])).toEqual(true);
  });
});
