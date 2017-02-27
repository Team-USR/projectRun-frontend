import React from 'react';
import { shallow } from 'enzyme';
import { Choice } from '../index';

describe('<Choice />', () => {
  const choiceTag = (<Choice
    value={2}
    choiceText={'choice'}
    id={2}
    key={2}
    inReview={false}
    callbackParent={() => false}
  />);
  it('Choice should have reviewState props set to false', () => {
    expect(shallow(choiceTag).instance().props.inReview).toBe(false);
  });
});
